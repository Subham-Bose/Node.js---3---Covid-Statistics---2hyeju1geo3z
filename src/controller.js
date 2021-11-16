const { connection } = require("./connector");

const totalRecovered = async (req, res) => {
  try {
    const allData = await connection.aggregate([
      {
        $group: { _id: "total", recovered: { $sum: "$recovered" } },
      },
    ]);

    res.status(200).json({ data: allData[0] });
  } catch (error) {
    res.status(500).json(error);
  }
};
const totalActive = async (req, res) => {
  try {
    const allData = await connection.aggregate([
      {
        $group: {
          _id: "total",
          active: { $sum: { $subtract: ["$infected", "$recovered"] } },
        },
      },
    ]);

    res.status(200).json({ data: allData[0] });
  } catch (error) {
    res.status(500).json(error);
  }
};
const totalDeath = async (req, res) => {
  try {
    const allData = await connection.aggregate([
      {
        $group: { _id: "total", death: { $sum: "$death" } },
      },
    ]);

    res.status(200).json({ data: allData[0] });
  } catch (error) {
    res.status(500).json(error);
  }
};

const hotspotStates = async (req, res) => {
  try {
    const allData = await connection.aggregate([
      {
        $project: {
          state: 1,
          rate: {
            $round: [
              {
                $divide: [
                  { $subtract: ["$infected", "$recovered"] },
                  "$infected",
                ],
              },
              5,
            ],
          },
        },
      },
    ]);
    const hotspot = allData.filter((obj) => {
      return obj.rate > 0.1;
    });

    res.status(200).json({ data: hotspot });
  } catch (error) {
    res.status(500).json(error);
  }
};

const healthyStates = async (req, res) => {
  try {
    const allData = await connection.aggregate([
      {
        $project: {
          state: 1,
          mortality: { $round: [{ $divide: ["$death", "$infected"] }, 5] },
        },
      },
    ]);
    const result = allData.filter((obj) => {
      return obj.mortality < 0.005;
    });
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  totalRecovered,
  totalActive,
  totalDeath,
  hotspotStates,
  healthyStates,
};
