const io = require('socket.io-client');
const socket = io.connect('http://localhost:3005');
const faker = require('faker');
const queue = []

require('dotenv').config();

socket.on("connect", () => {
  const store = {
    name: process.env.STORENAME,
    product: process.env.PRODUCT,
    open: false
  }
  if (!store.open) {
    store.open = !store.open
    socket.emit("ready", store)
  }
});



setInterval(function () {

  let orderItem = {
    _id: faker.datatype.uuid(),
    quantity: Math.floor(Math.random() * 10) + 1,
    item: '',
    customer: {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      address: `${faker.address.streetAddress()} ${faker.address.streetName()}`,
    }
  }

  orderItem.item = `${(orderItem.quantity > 1) ? 'boxes' : 'box'} of ${process.env.PRODUCT.toLowerCase()}`

  console.log(`Order up! ${orderItem._id}`)
  socket.emit('order', orderItem)
}, 15000)


socket.on('thanks', payload => {
  console.log(`${payload[0].name} delivered our package ${payload[1]._id}!`)
  let thankyou = `We appreciate you ${payload[0].name}`
  socket.emit('appreciation', thankyou)
})


