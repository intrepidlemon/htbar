// ****
// LOAD
// ****

const loadTime = new Date()

const loadYaml = async path => {
  try {
    // Fetch the YAML file
    const response = await fetch(path)
    const yamlText = await response.text()

    // Convert YAML to JSON
    const jsonData = jsyaml.load(yamlText)
    return jsonData
  } catch (error) {
    console.error('Error loading or parsing bio YAML:', error)
  }
}

// ******
// EVENTS
// ******

const eventLocation = location =>
  location
    ? `<div class="location">${location}</div>`
    : ``

const eventSpeakers = (allSpeakers, speakers) => speakers
  ? `<div class="speakers">
      ${speakers.map(s => eventSpeaker(allSpeakers[s] || {})).join(', ')}
     </div>`
  : ``

const eventName = name => `<div class="name">${name}</div>`


const eventDetails = (allSpeakers, name, location, speakers) => `
  <div class="details ">
    ${eventName(name)}
    ${eventLocation(location)}
    ${eventSpeakers(allSpeakers, speakers)}
  </div>
`

const eventDatetime = datetime => {
  const date = new Date(datetime)
  return `<div class="datetime">
    ${new Intl.DateTimeFormat(
      "en",
      {
        //dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(date)}
  </div>`
}

const eventSpeaker = ({
  sid,
  name,
}) => sid
  ? `<a class="event-speaker" href="#speaker-${sid}">${name}</a>`
  : ``

const event = allSpeakers => ({
  name,
  datetime,
  location,
  speakers,
}) => {
  return `<div class="event ${name === "break" ? "break" : ""}" id="event-${getHourTimestamp(datetime)}">
    ${eventDatetime(datetime)}
    ${eventDetails(allSpeakers, name, location, speakers)}
  </div>`
}

const dayEvents = allSpeakers => ({day, events}) => {
  return `
  <h3>${day}</h3>
  <div class="day" id="day-${day}">
    ${events.map(e => event(allSpeakers)(e)).join('')}
  </div>`
}

// ********
// SPEAKERS
// ********

const speaker = ({
  sid,
  name,
  bio,
  img,
}) => `<div class="speaker" id="speaker-${sid}">
  <div class="name">${name}</div>
  <div class="bio"> <img class="img" src="${img}" alt="${name}"/> ${bio} </div>
</div>`

// ****
// TIME
// ****

const getHourTimestamp = (date=loadTime) => {
  date = new Date(date)
  // Round down to the nearest hour
  date.setMinutes(0, 0, 0) // Sets minutes, seconds, and milliseconds to 0
  const timestamp = `${date.getTime()}`
  return timestamp
}

const scrollToHour = () => {
  const timestamp = getHourTimestamp()
  const eventDiv = document.getElementById(`event-${timestamp}`)
  if (eventDiv) {
    eventDiv.scrollIntoView({ behavior: 'smooth' })
  }
}

// ******
// RENDER
// ******

const renderSpeakers = speakers => {
  const contentDiv = document.getElementById('speakers')
  contentDiv.innerHTML = Object.values(speakers).map(speaker).join("")
}

const renderEvents = (speakers, agenda) => {
  const contentDiv = document.getElementById('events')
  contentDiv.innerHTML = agenda.map(dayEvents(speakers)).join("")
}

const renderTestScroll = () => {
  const contentDiv = document.getElementById('scroll-test-event')
  contentDiv.innerHTML = `<div id="event-${getHourTimestamp()}"></div>`
}

const render = async () => {
  const speakers = await loadYaml("speakers.yaml")
  const events = await loadYaml("events.yaml")
  console.log(speakers, events)
  renderEvents(speakers, events)
  renderSpeakers(speakers)
  //renderTestScroll()
  scrollToHour()
}

render()
