// ****
// LOAD
// ****

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

const event = now => allSpeakers => ({
  name,
  datetime,
  location,
  speakers,
}) => {
  const eventTimestamp = getTimestamp(datetime)
  return `<div class="
    event
    ${name === "break" ? "break" : ""}
    "
    id="event-${eventTimestamp}"
  >
    ${eventDatetime(datetime)}
    ${eventDetails(allSpeakers, name, location, speakers)}
  </div>`
}

const dayEvents = now => speakers => ({day, events}) => {
  return `
  <h3 class="day_header">${day}</h3>
  <div class="day" id="day-${day}">
    ${events.map(e => event(now)(speakers)(e)).join('')}
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
  <div class="bio"><img class="img" src="${img}" alt="${name}"/>${bio} </div>
</div>`

// ****
// TIME
// ****

const getTimestamp = datetime => {
  date = new Date(datetime)
  const timestamp = `${date.getTime()}`
  return parseInt(timestamp)
}

const findCurrent = (events, now) => {
  const nowTimestamp = getTimestamp(now)
  let current = getTimestamp(events[0].events[0].datetime)
  let last = getTimestamp(events[0].events[0].datetime)
  for (let day of events) {
    for (let event of day.events) {
      current = getTimestamp(event.datetime)
      if (nowTimestamp < current) {
        return last
      }
      last = current
    }
  }
}

const highlightNow = (events, now) => {
  const current = findCurrent(events, now)
  if (current !== null) {
    const eventDiv = document.getElementById(`event-${current}`)
    if (eventDiv) {
      eventDiv.classList.add("current")
      eventDiv.scrollIntoView({ behavior: 'smooth', block: "center" })
    }
  }
}

// ******
// RENDER
// ******

const renderSpeakers = speakers => {
  const contentDiv = document.getElementById('speakers')
  contentDiv.innerHTML = Object.keys(speakers).toSorted().map(s => speaker(speakers[s])).join("")
}

const renderEvents = now => speakers => agenda => {
  const contentDiv = document.getElementById('events')
  contentDiv.innerHTML = agenda.map(dayEvents(now)(speakers)).join("")
}

const render = async () => {
  const speakers = await loadYaml("speakers.yaml")
  const events = await loadYaml("events.yaml")
  console.log(speakers, events)

  let now = new Date()
  //now = events[2].events[4].datetime // for testing

  renderSpeakers(speakers)
  renderEvents(now)(speakers)(events)
  highlightNow(events, now)

  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 1000);
  }
}

render()
