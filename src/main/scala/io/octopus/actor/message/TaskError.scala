package io.octopus.actor.message

import io.octopus.model.TaskInstance

case class TaskError(instance: TaskInstance, error: String = null)