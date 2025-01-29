import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className: { 
        type: String, 
        required: true, 
        unique: true 
    },
    section: { 
        type: String, 
        required: true 
    },
    teacher: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Teacher', 
        required: true 
    },
    students: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student' 
    }],
    timetable: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lecture' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Class = mongoose.model('Class', classSchema);

export default Class