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
    // Use template literals to render JSON data
    const contentDiv = document.getElementById('speakers')
    contentDiv.innerHTML = Object.values(speakers).map(speaker).join("")
}

const eventSpeaker = ({
  sid,
  name,
}) => `<a class="event-speaker" href="#speaker-${sid}">${name}</a>`

const event = allSpeakers => ({
  name,
  datetime,
  location,
  speakers,
}) => `<div class="event" id="event-${datetime}">
  <div class="name">${name}</div>
  <div class="datetime">${datetime}</div>
  <div class="location">${location}</div>
  <div class="speakers">${speakers.map(s => eventSpeaker(allSpeakers[s])).join()}</div>
</div>`

const renderEvents = (speakers, events) => {
    // Use template literals to render JSON data
    const contentDiv = document.getElementById('events')
    contentDiv.innerHTML = events.map(event(speakers)).join("")
}

const render = async () => {
  const speakers = await loadYaml("speakers.yaml")
  const events = await loadYaml("events.yaml")
  console.log(speakers, events)
  renderEvents(speakers, events)
  renderSpeakers(speakers)
}

render()
