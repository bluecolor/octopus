package io.octopus.actor.message

import io.octopus.model.User

case class SendNewPasswordMail(user: User, password: String)