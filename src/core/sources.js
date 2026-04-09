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
    name: "woodColor",
    type: "texture",
    textureType: "color",
    path: "textures/wood/Wood051_1K-JPG_Color.jpg",
  },
  {
    name: "woodRoughness",
    type: "texture",
    textureType: "mask",
    path: "textures/wood/Wood051_1K-JPG_Roughness.jpg",
  },
  {
    name: "woodNormal",
    type: "texture",
    textureType: "normal",
    path: "textures/wood/Wood051_1K-JPG_NormalGL.jpg",
  },
  {
    name: "leatherColor",
    type: "texture",
    textureType: "color",
    path: "textures/leather/Leather034A_1K-JPG_Color.jpg",
  },
  {
    name: "leatherRoughness",
    type: "texture",
    textureType: "mask",
    path: "textures/leather/Leather034A_1K-JPG_Roughness.jpg",
  },
  {
    name: "leatherNormal",
    type: "texture",
    textureType: "normal",
    path: "textures/leather/Leather034A_1K-JPG_NormalGL.jpg",
  },
  {
    name: "suzanne",
    type: "gltfModel",
    path: "models/Suzanne.glb",
  },
];
