const { Observable } = require('rxjs')
const Stream = require('stream')

const observable = new Observable((subscriber) => {
  let i = 0
  const intervalId = setInterval(() => {
    if (i < 0) {
      subscriber.error(new Error('number must be positive integer'))
    }
    subscriber.next(i)
    i++
    if (i === 11) {
      subscriber.complete()
    }
  }, 1000)
  return () => {
    console.log('in unsubscribe')
    clearInterval(intervalId)
  }
})

const readableStream = new Stream.Readable({
  read: (x) => {
  }
})
const unsubscribe = observable.subscribe({
  next (x) {
    console.log('in next', x)
    // console.log('got value ' + x)
    readableStream.push(x + '\n')
  },
  error (err) {
    console.log('in error', err)
    // console.error('something wrong occurred: ' + err)
    readableStream.emit('error', err)
  },
  complete () {
    console.log('in complete')
    readableStream.push(null)
  }
})

setTimeout(() => {
  unsubscribe.unsubscribe()
}, 5000)

readableStream.pipe(process.stdout)
