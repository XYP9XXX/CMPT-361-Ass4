import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

// Example two triangle quad
const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1],
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

TriangleMesh.prototype.createCube = function() {
  // TODO: populate unit cube vertex positions, normals, and uv coordinates
  this.positions = [
    // Front
    -1, -1, 1,  1, -1, 1,  1, 1, 1,  // Triangle 1
    -1, -1, 1,  1, 1, 1, -1, 1, 1,   // Triangle 2

    // Back
    1, -1, -1, -1, -1, -1, -1, 1, -1,   // Triangle 1
    1, -1, -1, -1, 1, -1,  1, 1, -1,    // Triangle 2

    // Left
    -1, -1, -1, -1, -1, 1, -1, 1, 1,   // Triangle 1
    -1, -1, -1, -1, 1, 1, -1, 1, -1,   // Triangle 2

    // Right
    1, -1, 1,  1, -1, -1, 1, 1, -1,   // Triangle 1
    1, -1, 1,  1, 1, -1, 1, 1, 1,     // Triangle 2

    // Top
    -1, 1, 1,  1, 1, 1,  1, 1, -1,   // Triangle 1
    -1, 1, 1,  1, 1, -1, -1, 1, -1,  // Triangle 2

    // Bottom
    -1, -1, -1,  1, -1, -1,  1, -1, 1,   // Trianle 1
    -1, -1, -1,  1, -1, 1, -1, -1, 1,    // Triangle 2
];
  this.normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                  0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 
                  -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 
                  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 
                  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 
                  0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, ]
  
  // Calculate and implement each vertices' uv coordinates corresponding to different faces.
  this.uvCoords = [0, 2/3, 1/2, 2/3, 1/2, 1, 0, 2/3, 1/2, 1, 0, 1,
                   1, 0, 1/2, 0, 1/2, 1/3, 1, 0, 1/2, 1/3, 1, 1/3, 
                   1/2, 1/3, 1, 1/3, 1, 2/3, 1/2, 1/3, 1, 2/3, 1/2, 2/3, 
                   0, 1/3, 1/2, 1/3, 1/2, 2/3, 0, 1/3, 1/2, 2/3, 0, 2/3, 
                   0, 0, 1/2, 0, 1/2, 1/3, 0, 0, 1/2, 1/3, 0, 1/3,
                   1/2, 1, 1, 1, 1, 2/3, 1/2, 1, 1, 2/3, 1/2, 2/3,]
}

TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  this.positions = [];
  this.normals = [];
  this.uvCoords = [];
  this.indices = [];

  // Vertex position
  var x, y, z, xy;          

  // UV coordinates
  var u, v;                                      

  // These two variables are used for calculating stackAngle (-90 degree to 90 degree) and sectorAngle (0 to 360 degree)
  var sectorStep = 2 * Math.PI / numSectors;
  var stackStep = Math.PI / numStacks;

  // These two variables are used for storing the sector angle and stack angle.
  var sectorAngle, stackAngle;

  for(var i = 0; i <= numStacks; ++i) {
    // for -90 degree to 90 degree
    stackAngle = Math.PI / 2 - i * stackStep;

    // r * cos(u)
    xy = Math.cos(stackAngle);        

    // r * sin(u)
    z = Math.sin(stackAngle);         

    for(var j = 0; j <= numSectors; ++j) {
      // from 0 to 2pi
      sectorAngle = j * sectorStep;          

      // r * cos(u) * cos(v)
      x = xy * Math.cos(sectorAngle);        

      // r * cos(u) * sin(v)
      y = xy * Math.sin(sectorAngle);        
      this.positions.push(x, y, z);

      // Normal vector of each vertex, because in our case, the center of the sphere is the origin, so the normal vector is equal the coordinates of the intices.
      this.normals.push(x, y, z);

      // UV coordinates
      u = j / numSectors;
      v = i / numStacks;
      this.uvCoords.push(1 - u, v);
    }
  }

    // generate indices
    var k1, k2;

    for(var i = 0; i < numStacks; ++i) {
      // beginning of current stack
      k1 = i * (numSectors + 1);    

      // beginning of next stack
      k2 = k1 + numSectors + 1;     

      for(var j = 0; j < numSectors; ++j, ++k1, ++k2) {
        if(i !== 0) {
          this.indices.push(k1, k2, k1 + 1);
        }
        if(i !== (numStacks - 1)) {
          this.indices.push(k1 + 1, k2, k2 + 1);
        }
      }
    }
}

Scene.prototype.computeTransformation = function(transformSequence) {
  // Identity matrix
  let overallTransform = Mat4.create();  

  // Change the input transformSequence to String, for futher operation.
  transformSequence = String(transformSequence);

  // Split the transformSequence
  let commands = transformSequence.split(',');

  // Traverse index
  var i = 0;

  // Start traserse the input
  while (i < commands.length) {
    // Get the transformation format (i.e. Rz, Rx, Ry, S, T)
    let type = commands[i]; 

    // Get the three parameter of each transformation (for each transformation we have 3 parameters, even for rotate.)
    let x = parseFloat(commands[i+1]);  
    let y = parseFloat(commands[i+2]);  
    let z = parseFloat(commands[i+3]);  

    // Set index to next transformation format
    i += 4;

    // Create a new transformation matrix to store the temp matrix
    let transformMatrix = Mat4.create();

    // Switch case
    switch (type) {
      // rotate around Z
      case 'Rz':
        // Change degree to radian
        let radiansZ = x * Math.PI / 180;
        let cosZ = Math.cos(radiansZ);
        let sinZ = Math.sin(radiansZ);
        Mat4.set(transformMatrix,
          cosZ, -sinZ, 0, 0,
          sinZ, cosZ, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1);

        // Transpose the matrix to row wise as original is column wise
        Mat4.transpose(transformMatrix, transformMatrix);
        break;

      // Rotate around X
      case 'Rx':
        let radiansX = x * Math.PI / 180;  
        let cosX = Math.cos(radiansX);
        let sinX = Math.sin(radiansX);
        Mat4.set(transformMatrix,
          1, 0, 0, 0,
          0, cosX, -sinX, 0,
          0, sinX, cosX, 0,
          0, 0, 0, 1);
        Mat4.transpose(transformMatrix, transformMatrix);
          break;

      // Rotate around Y
      case 'Ry':
        let radiansY = x * Math.PI / 180; 
        let cosY = Math.cos(radiansY);
        let sinY = Math.sin(radiansY);
        Mat4.set(transformMatrix,
          cosY, 0, sinY, 0,
          0, 1, 0, 0,
          -sinY, 0, cosY, 0,
          0, 0, 0, 1);
        Mat4.transpose(transformMatrix, transformMatrix);
        break;

      // Scale
      case 'S':
        Mat4.set(transformMatrix,
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1);
        Mat4.transpose(transformMatrix, transformMatrix);
        break;

      // Translate
      case 'T':
        Mat4.set(transformMatrix,
          1, 0, 0, x,
          0, 1, 0, y,
          0, 0, 1, z,
          0, 0, 0, 1);
        Mat4.transpose(transformMatrix, transformMatrix);
          break;
    }

    // Multiply the temp matrix to the overall transformation matrix (Warrning!! need to put temp matrix at the front to ensure correct order.)
    Mat4.multiply(overallTransform, transformMatrix, overallTransform);
  }

  return overallTransform;
}

Renderer.prototype.VERTEX_SHADER = `
//The main task of the vertex shader is to process vertex data, calculate the position of the vertex in clip space, and pass the necessary data to the fragment shader.
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;

uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;

// Some variable which are passed to fragment shader.
varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 viewDir;

void main() {
    // Used for uv coordinate
    vTexCoord = uvCoord;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    // Normal of the surface
    vNormal = normalize(normalMatrix * normal);

    // Calculate the position of vertices after transform
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPosition = vec3(worldPosition);

    // Assume the camera is at the origin point
    vec3 cameraPosition = vec3(viewMatrix * vec4(0.0, 0.0, 0.0, 1.0));
    viewDir = normalize(cameraPosition - vec3(worldPosition));
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;

uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
uniform vec3 lightPosition;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 viewDir;

void main() {
    // Calculate the ambient part
    vec3 ambient = ka * lightIntensity;

    // Calculate the Lambertian part
    vec3 lightDir = normalize(lightPosition - vPosition); // direction of light is equal to position of light minus position of particular point
    float lightLength = length(lightPosition - vPosition); // lightLength is the position from light to the object surface.
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 diffuse = kd * diff * lightIntensity / pow(lightLength, 2.0);

    // Calculate the specular part
    vec3 halfVector = normalize(lightDir + viewDir);
    float spec = pow(max(dot(halfVector, vNormal), 0.0), shininess);
    vec3 specular = ks * spec * lightIntensity / pow(lightLength, 2.0);

    // combine three part together, we get the Blinn-Phong reflection model
    vec3 color = ambient + diffuse + specular;

    // Check if has texture
    if (hasTexture) {
        gl_FragColor = texture2D(uTexture, vTexCoord) * vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(color, 1.0);
    }
}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
  "l,myLight,point,0,5,0,2,2,2;",
  "m,sunMat,1,0.5,0,1,1,0.5,1,1,1,10,sun.jpg;",
  "m,earthMat,0.1,0.3,0.6,0.7,0.7,0.7,1,1,1,15,globe.jpg;",
  "m,moonMat,0.5,0.5,0.5,0.6,0.6,0.6,1,1,1,5,globe.jpg;",
  "p,sun,sphere,30,30;",
  "p,earth,sphere,20,20;",
  "p,moon,sphere,10,10;",
  "o,sun,sun,sunMat;",
  "o,earth,earth,earthMat;",
  "o,moon,moon,moonMat;",
  "X,earth,T,10,0,0;X,earth,S,0.3,0.3,0.3;",
  "X,moon,T,12,0,0;X,moon,S,0.15,0.15,0.15;",
  "X,sun,T,-1, 0, 0;",
].join("\n");

// "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
//   "l,myLight,point,0,5,0,2,2,2;",
//   "p,unitCube,cube;",
//   "p,unitSphere,sphere,20,20;",
//   "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
//   "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
//   "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
//   "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
//   "o,rd,unitCube,redDiceMat;",
//   "o,gd,unitCube,grnDiceMat;",
//   "o,bd,unitCube,bluDiceMat;",
//   "o,gl,unitSphere,globeMat;",
//   "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
//   "X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
//   "X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
//   "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;",

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };

