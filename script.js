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
  name,
  bio,
  img,
}) => `<div class="speaker">
  <img class="img" src="${img}" alt="${name}"/>
  <div class="name">${name}</div>
  <div class="bio">${bio}</div>
</div>`

const renderSpeakers = speakers => {
    // Use template literals to render JSON data
    const contentDiv = document.getElementById('speakers')
    contentDiv.innerHTML = Object.values(speakers).map(speaker).join("")
}

const event = ({
  name,
  datetime,
  description,
  speakers,
}) => `<div class="event">
  <div class="name">${name}</div>
  <div class="datetime">${datetime}</div>
  <div class="description">${description}</div>
  <ul class="speakers">${speakers}</div>
</div>`

const renderEvents = speakers => {
    // Use template literals to render JSON data
    const contentDiv = document.getElementById('speakers')
    contentDiv.innerHTML = Object.values(speakers).map(speaker).join("")
}

const render = async () => {
  const speakers = await loadYaml("speakers.yaml")
  const events = await loadYaml("events.yaml")
  console.log(speakers)
  //const events = loadYaml("events.yaml")
  renderSpeakers(speakers)
}

render()
