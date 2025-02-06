const {Schema, model} = require('mongoose');

const blogSchema = new Schema({
    author:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:"Explore This Blog..."
    },
    content:{
        type:String,
        required:true,
    },
    bgColor:{
        type:String,
        default: "#ffffff",
    },
    comments : [
        {
            username:{
                type:String, required:true,
            },
            description:{
                type:String, required:true,
            },
            date:{
                type:String, required:true,
            }
        }
    ]
}, {timestamps:true});

const Blog = model("blogs",blogSchema);
module.exports = Blog;