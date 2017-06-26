package io.octopus.actor.message

import io.octopus.model.TaskInstance

case class TaskSuccess(instance: TaskInstance)