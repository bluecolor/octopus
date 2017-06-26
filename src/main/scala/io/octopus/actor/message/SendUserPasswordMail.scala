package io.octopus.actor.message

import io.octopus.model.User

case class SendUserPasswordMail(user: User, password: String)