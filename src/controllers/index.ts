export {
  AuthControllerValidation,
  default as AuthController,
} from "./auth.controller";
export {
  default as UserController,
  UserControllerValidation,
} from "./user.controller";

// const subController = fs.readdirSync(path.join(__dirname));
// const makeObject: any = {};

// for (const fileAre of subController) {
//   (async () => {
//     if (fileAre.includes(".controller")) {
//       // Define the path to the module file
//       const modulePath = path.join(__dirname, fileAre);
//       // console.log(modulePath);
//       const fileSplit = fileAre.split(".");

//       let validateName = `${
//         fileSplit[0]?.[0].toUpperCase() +
//         fileSplit[0].slice(1, fileSplit[0].length) +
//         fileSplit[1]?.[0].toUpperCase() +
//         fileSplit[1].slice(1, fileSplit[1].length)
//       }Validation`;

//       makeObject[
//         `${
//           fileSplit[0]?.[0].toUpperCase() +
//           fileSplit[0].slice(1, fileSplit[0].length) +
//           fileSplit[1]?.[0].toUpperCase() +
//           fileSplit[1].slice(1, fileSplit[1].length)
//         }`
//       ] = await import(modulePath).then((module) => {
//         return new module.default();
//       });

//       // console.log({ validateName });
//       makeObject[validateName] = await import(modulePath).then(
//         (module) => module?.[validateName]
//       );
//     }
//   })();
// }
// const exportedValues = Object.assign(makeObject);
// setTimeout(() => {
//   console.log(exportedValues);
// }, 6000);

// export default exportedValues;
