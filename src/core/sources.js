/**
 * Supported Types = [
 *  gltfModel,
 *  texture,
 *  cubeTexture,
 *  environmentTexture,
 *  font
 * ]
 */

export default [
  {
    name: "environmentMapTexture",
    type: "environmentTexture",
    path: "textures/environments/lighting.hdr",
  },
  {
    name: "noiseTexture",
    type: "texture",
    textureType: "mask",
    path: "textures/noise.jpg",
  },
  {
    name: "bike",
    type: "gltfModel",
    path: "models/MountainBike.glb",
  },
];
