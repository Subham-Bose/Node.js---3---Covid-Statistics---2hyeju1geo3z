const express = require("express");
const router = express.Router();
const {
  totalRecovered,
  totalActive,
  totalDeath,
  hotspotStates,
  healthyStates,
} = require("./controller");

router.route("/totalRecovered").get(totalRecovered);
router.route("/totalActive").get(totalActive);
router.route("/totalDeath").get(totalDeath);
router.route("/hotpotStates").get(hotspotStates);
router.route("/healthStates").get(healthyStates);

module.exports = router;
