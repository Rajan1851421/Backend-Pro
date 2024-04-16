import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required:true
    },
    thumnail: {
        type: String,
        required:true
      },
      title: {
        type: String,
        required:true
      },
      desription: {
        type: String,
        required:true
      },
      duration: {
        type: number,
        required:true
      },
      views:{
        type:number,
        default:0
      },
      isPublished:{
        type:Boolean,
        default:true
      },
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginateF)
export const Video = mongoose.model("Video", videoSchema);
