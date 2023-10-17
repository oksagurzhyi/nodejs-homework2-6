const { model, Schema } = require("mongoose");
const { compare, genSalt, hash } = require("bcrypt");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    veryfied: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// // Pre save mongoose hook. Fires on "create" and "save"
userSchema.pre("save", async function (next) {
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

//  Custom mongoose method to validate password.

// userSchema.methods.checkPassword = (candidate, hashPassword) =>
//   compare(candidate, hashPassword);

userSchema.methods.checkPassword = async function (candidatePassword) {
  const isMatch = await compare(candidatePassword, this.password);
  return isMatch;
};

const User = model("user", userSchema);

module.exports = User;
