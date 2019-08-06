workflow "Notify on release" {
  on = "release"
  resolves = ["GitHub Action for Slack"]
}

action "GitHub Action for Slack" {
  uses = "Ilshidur/action-slack@e53b10281b03b02b016e1c7e6355200ee4d93d6d"
  secrets = ["SLACK_WEBHOOK"]
  args = "Release {{ EVENT_PAYLOAD.release.tag_name }}"
}
