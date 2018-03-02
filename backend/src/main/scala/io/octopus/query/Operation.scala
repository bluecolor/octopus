package io.octopus.query

class Operation {
  def this(l:String, o: String, r: String) {
    this()
    this.l = l
    this.o = o
    this.r = r
  }
  var l: String = _ // left side of exp.
  var o: String = _ // operation
  var r: String = _ // right side of exp.
  var p: AnyRef = _ // bind variable
}
