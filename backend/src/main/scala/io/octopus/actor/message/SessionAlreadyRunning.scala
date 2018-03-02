package io.octopus.actor.message

import io.octopus.model.Session

case class SessionAlreadyRunning(session: Session)