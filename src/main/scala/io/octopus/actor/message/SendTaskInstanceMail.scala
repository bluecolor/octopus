package io.octopus.actor.message

import io.octopus.model.TaskInstance

case class SendTaskInstanceMail(instance: TaskInstance)