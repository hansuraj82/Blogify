const {createHmac,randomBytes} = require("crypto");
const { Schema,model } = require('mongoose');
const { generateTokenForUser } = require("../services/authentication");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: "https://res.cloudinary.com/daa7fpyaw/image/upload/v1754158698/Blog-cover-photo/wa1iuwr3tmxw1yuf5qlo.png"
    },
    role: {
        type: String,
        enum: ['ADMIN','USER'],
        default: "USER"
    },
    salt: {
        type: String,
    }


},
{
    timestamps: true
}
);


userSchema.pre("save", async function (next) {
    const user = this;
    if(!user.isModified("password")) return ;
    
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt)
    .update(user.password)
    .digest('hex');

    this.password = hashedPassword;
    this.salt = salt;

    next();
})

userSchema.static("matchPasswordAndGenerateToken",async function({email,password}) {
    const user = await this.findOne({email: email});
    if(!user) throw new Error('User not found');
    const hashedPassword = user.password;
    const EnteredPasswordHashing = createHmac('sha256',user.salt).update(password).digest('hex');
    if(hashedPassword != EnteredPasswordHashing)  throw new Error('Incorrect password');
    const token = generateTokenForUser(user);
    return token;
    
})

const User = model("User",userSchema);

module.exports = User;