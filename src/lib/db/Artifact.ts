import { Model, model, Schema, SchemaTypes } from 'mongoose';

export interface IArtifact {
  id: string;
  title: string;
  date: Date;
  thumbnail: string;
  type: string;
  tags: string[];
  data: Map<string, any>;
}

export const ArtifactSchema = new Schema<IArtifact, Model<IArtifact>>({
  id: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    index: true,
    required: true,
    lowercase: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  tags: {
    type: [
      {
        type: String,
        lowercase: true,
      },
    ],
    index: true,
    default: [],
  },
  data: {
    type: SchemaTypes.Map,
    of: SchemaTypes.Mixed,
    default: new Map(),
  },
});

export const Artifact = model<IArtifact, Model<IArtifact>>('Artifact', ArtifactSchema);
