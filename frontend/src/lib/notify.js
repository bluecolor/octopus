
import PNotify from 'pnotify'
import 'pnotify/dist/pnotify.desktop'

PNotify.prototype.options.styling = 'fontawesome'
PNotify.desktop.permission()

const success = (message) => {
  new PNotify({ // eslint-disable-line no-new
    title: 'Success',
    type: 'success',
    text: message
  })
}

const error = (message) => {
  new PNotify({ // eslint-disable-line no-new
    title: 'Error',
    type: 'error',
    text: message
  })
}

const denoError = (message) => {
  const deno = new PNotify({
    title: '',
    text: message,
    desktop: {
      desktop: true,
      icon: 'http://localhost:8080/static/img/bell_red.png'
    }
  })
  deno.get().click(e => {
    window.focus()
    this.hide()
  })
}

const denoSuccess = (message) => {
  const deno = new PNotify({
    title: '',
    text: message,
    desktop: {
      desktop: true,
      icon: 'http://localhost:8080/static/img/ok_green.png'
    }
  })
  deno.get().click(e => {
    window.focus()
    this.hide()
  })
}

export {
  success,
  error,
  denoError,
  denoSuccess
}
