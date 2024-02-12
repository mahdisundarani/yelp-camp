const mongoose = require('mongoose');
const cities = require('./cities')
const {places,descriptors} = require('./seedHelper')
const Campground = require('../models/campground');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(()=>{
        console.log("Connection successfull")
        })
        .catch((err)=>{
        console.log("ERROR!!!")
        console.log(err)
        })

const sample = array => array[Math.floor(Math.random() * array.length)];

     
const seedDB = async ()=>{
    await Campground.deleteMany({})
    for(let i = 0;i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) +10;
        const camp = new Campground({
            author: '65649485db9dad867600df74',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} , ${sample(places)} `,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora exercitationem et perspiciatis totam neque iure consectetur beatae dolore id hic, quo distinctio, perferendis autem minus quisquam commodi nemo quia eum!',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dv71jhlp2/image/upload/v1701427464/yelp%20camp/zfokr3qnzqar1izqvx8s.jpg',
                  filename: 'yelp camp/zfokr3qnzqar1izqvx8s',
                },
                {
                  url: 'https://res.cloudinary.com/dv71jhlp2/image/upload/v1701427466/yelp%20camp/gt6ubxsq5siybvyzjryn.jpg',
                  filename: 'yelp camp/gt6ubxsq5siybvyzjryn',
                }
              ],
        })
        await camp.save();
    }
}

seedDB()