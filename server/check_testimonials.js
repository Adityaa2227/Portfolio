const mongoose = require('mongoose');
const Testimonial = require('./models/Testimonial');
require('dotenv').config();

const checkTestimonials = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const all = await Testimonial.find({});
        console.log(`Total: ${all.length}`);
        const approved = await Testimonial.find({ isApproved: true });
        console.log(`Approved: ${approved.length}`);
        
        if (all.length > 0 && approved.length === 0) {
            console.log("Approving all testimonials for demo purposes...");
            await Testimonial.updateMany({}, { isApproved: true });
            console.log("All testimonials approved.");
        }
        
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
checkTestimonials();
