# Figma design workflow

Editable welcome screen: https://www.figma.com/design/T9DHnTbTcZ3gGUZpWfePSB?node-id=3-2

Mobile welcome screen: https://www.figma.com/design/T9DHnTbTcZ3gGUZpWfePSB?node-id=19-2

The desktop and mobile welcome screens use the Pocket OS retro design with
editable auto-layout frames, text, and pixel vectors. IBM Plex Sans substitutes
for the app's Tahoma, with IBM Plex Mono for system labels. The flame is static
in Figma. Edit a screen and share its frame link here to implement changes in
React; this is not a live code connection.

Sections are named for navigation, shortcuts, the welcome window, the Ember brand
panel, introduction/start button, features, and status bar. These are editable
frames, not a published reusable component library.

A Figma capture script was added to the root HTML for this workflow. It supports
future captures using the Figma capture toolbar; it does not sync design edits
back to the application automatically.

## Clickable prototype

Prototype: https://www.figma.com/proto/T9DHnTbTcZ3gGUZpWfePSB?node-id=3-2&starting-point-node-id=3%3A2

Added login, signup, dashboard, missions, character, new-mission and About dialogs,
signup confirmation, mission creation/completion/deletion and attribute states.
The file is organized in development priority order: `01 · Mobile Web`,
`02 · iOS`, and `03 · Desktop`. The mobile welcome screen is on Mobile Web;
iOS is reserved for the second phase, and existing desktop screens and dialogs
are on Desktop.
Both welcome layouts have prototype starting points. Mobile Web has 18
screens/dialogs covering login, signup, dashboard, missions, character, mission
creation/completion/deletion, and each attribute increase state. Its 97 prototype
links have valid destinations on the Mobile Web page. Full mobile screens use a
390 × 844 viewport, scrollable content, and bottom navigation; dialogs are 358px
wide. Visual checks found no content bounds issues.

Mobile prototype: https://www.figma.com/proto/T9DHnTbTcZ3gGUZpWfePSB?node-id=30-2&starting-point-node-id=30%3A2

The Mobile Web flow now starts with `Kaizen / Loading / Mobile Web`: a 3-second
spark-to-flame ignition, progress animation to 100%, Japanese Kaizen wordmark
(`改善`), and an Ember footer showing `v0.1.0-alpha`. It then dissolves into
the mobile welcome screen.

New views use editable auto-layout frames with IBM Plex Mono and example data.
Forms are preset examples and interactions are fixed demonstration states, not
real authentication, editable runtime inputs, or a database.
