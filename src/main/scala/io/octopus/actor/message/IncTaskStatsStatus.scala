package io.octopus.actor.message

import io.octopus.model.Task

case class IncTaskStatsStatus(task: Task, status: String)