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
// SPEAKERS

const speaker = ({
  sid,
  name,
  bio,
  img,
}) => `<div class="speaker" id="speaker-${sid}">
  <img class="img" src="${img}" alt="${name}"/>
  <div class="name">${name}</div>
  <div class="bio">${bio}</div>
</div>`

const renderSpeakers = speakers => {
  const contentDiv = document.getElementById('speakers')
  contentDiv.innerHTML = Object.values(speakers).map(speaker).join("")
}

const eventSpeaker = ({
  sid,
  name,
}) => `<a class="event-speaker" href="#speaker-${sid}">${name}</a>`

const getHourTimestamp = (date=loadTime) => {
  date = new Date(date)
  // Round down to the nearest hour
  date.setMinutes(0, 0, 0) // Sets minutes, seconds, and milliseconds to 0
  const timestamp = `${date.getTime()}`
  return timestamp
}


const event = allSpeakers => ({
  name,
  datetime,
  location,
  speakers,
}) => {
  const date = new Date(datetime)
  return `<div class="event" id="event-${getHourTimestamp(date)}">
    <div class="details">
      <div class="name">${name}</div>
      <div class="datetime">${new Intl.DateTimeFormat("en", {dateStyle: "medium", timeStyle: "short"}).format(date)}</div>
    </div>
    <div class="location">${location}</div>
    <div class="speakers">${speakers.map(s => eventSpeaker(allSpeakers[s])).join()}</div>
  </div>`
}

const renderEvents = (speakers, events) => {
  const contentDiv = document.getElementById('events')
  contentDiv.innerHTML = events.map(event(speakers)).join("")
}

const scrollToHour = () => {
  const timestamp = getHourTimestamp()
  const eventDiv = document.getElementById(`event-${timestamp}`)
  if (eventDiv) {
    eventDiv.scrollIntoView({ behavior: 'smooth' })
  }
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
