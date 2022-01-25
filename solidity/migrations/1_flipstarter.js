const Migrations = artifacts.require("./flipstarter");
/*
module.exports = function (deployer) {
  deployer.deploy(Migrations, "1000000000000000000");
};
*/

module.exports = function (deployer) {
  deployer.deploy(
    Migrations,
    // title
    "build a new project similar to Flip Starter with smart contracts",
    // summary
    "https://gist.github.com/salemkode/f5a903bd661d8e0154520a952cf8ee9f/raw/113e52776356fa6362776510e446f96552ef3bfd/summary.md",
    // proposal
    "https://gist.github.com/salemkode/f5a903bd661d8e0154520a952cf8ee9f/raw/113e52776356fa6362776510e446f96552ef3bfd/propsoal.md",
    // goal
    "10000000000000000000",
    // name
    "SalemKode",
    // website
    "https://salemkode.com",
    // photo
    "https://salemkode.com/landing-image.png"
  );
};
