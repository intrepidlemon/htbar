# HTBAR Conference Website - Developer Guide

This document describes the HTBAR (How To Be An Academic Radiologist) conference website structure and the annual update workflow.

## Repository Overview

- **Domain**: tbar.how (via GitHub Pages)
- **Purpose**: Annual Penn Radiology conference for first-year residents
- **Architecture**: Static site with dynamic YAML-driven content rendering

## File Structure

```
htbar/
├── index.html          # Main conference page
├── speakers.yaml       # Speaker database
├── events.yaml         # Conference schedule
├── script.js           # YAML parser and renderer
├── style.css           # Styling
├── img/                # Speaker headshots
├── CNAME               # Domain config
└── *.html              # Additional pages (alumni, links, etc.)
```

## YAML Schema Reference

### speakers.yaml

Each speaker entry must have:

```yaml
speaker_id:              # lowercase key, no spaces
  sid: speaker_id        # must match the key exactly
  name: "Full Name, MD"  # include credentials
  img: img/lastname.jpg  # path to headshot (jpg, png, or jpeg)
  bio: |                 # use literal block for multi-line
    Biography text here. Must be indented under bio:|
```

### events.yaml

```yaml
- day: Monday, February 2, 2026
  events:
  - name: "Event Title"
    datetime: 2026-02-02T07:30:00-04:00   # ISO 8601 with -04:00 (EDT)
    location: Donner-Grice Lecture Hall
    speakers:                              # optional
      - speaker_id1                        # space after dash required
      - speaker_id2
```

## Annual Update Workflow

Based on git history patterns, updates typically happen 2-4 weeks before the conference.

### Step 1: Prepare New Data Files

1. Obtain new speaker list and event schedule
2. Create `new_speakers.yaml` and `new_events.yaml` (or similar staging files)
3. Validate YAML syntax before proceeding

### Step 2: Validate Speaker File

Check for:
- All required fields present: `sid`, `name`, `img`, `bio`
- Bio text properly indented (4 spaces after `bio: |`)
- Image paths follow `img/<name>.<ext>` convention
- Speaker IDs are lowercase, no spaces

### Step 3: Validate Events File

Check for:
- Proper YAML syntax (space after `-` in arrays)
- No orphaned/empty speaker entries
- All speaker IDs exist in speakers.yaml
- Correct datetime format (ISO 8601 with timezone)
- No typos in event names

### Step 4: Cross-Reference Validation

```bash
# Extract speaker IDs from events
grep -oP "(?<=- )[a-z_]+" events.yaml | sort -u > events_speakers.txt

# Extract speaker IDs from speakers file
grep -oP "^[a-z_]+:" speakers.yaml | tr -d ':' | sort -u > speakers_list.txt

# Find missing speakers (referenced in events but not defined)
comm -23 events_speakers.txt speakers_list.txt
```

### Step 5: Update Images

- Add speaker headshots to `img/` directory
- Naming convention: `img/<lastname>.<ext>`
- Supported formats: jpg, png, jpeg
- Images can be added later; site will show broken images until uploaded

### Step 6: Replace Production Files

```bash
cp new_speakers.yaml speakers.yaml
cp new_events.yaml events.yaml
```

### Step 7: Test Locally

1. Open `index.html` in browser
2. Verify events render with correct times
3. Verify speaker cards display correctly
4. Check browser console for JavaScript errors

## Common Issues and Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Missing space after `-` | YAML parse error | Add space: `- speaker_id` |
| Unindented bio | Bio not showing | Indent 4 spaces after `bio: |` |
| Wrong image path | Broken image | Check filename matches `img` field |
| Speaker ID mismatch | Speaker not linking | Ensure events use exact ID from speakers file |
| Empty speaker array | YAML error | Remove `speakers:` field entirely |

## Locations Reference

Common venue names used in events:
- `Donner-Grice Lecture Hall`
- `Donner 2 Conference Room`
- `PCAM 15 South Collaboration Center`
- `PCAM conference room`

## Archive Pattern

Previous years' events are typically commented out at the end of events.yaml for reference:
```yaml
# - day: Monday, April 8, 2024
#   events:
#   ...
```
