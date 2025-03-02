const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.getAllTasks = async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 10);
    const page = Number(req.query.page ?? 1);

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("position", { ascending: true })
      .range(start, end);

    if (error) {
      throw error;
    }

    res.json({
      data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message ?? error });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { data: taskData } = req.body;
    const { error } = await supabase.from("tasks").insert(taskData);

    if (error) {
      throw error;
    }

    res.status(201).json({
      message: "Successfully created task.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message ?? error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: taskData } = req.body;

    const modifiedDate = new Date().toISOString();

    taskData.modified_at = modifiedDate;

    const { data, error } = await supabase
      .from("tasks")
      .update(taskData)
      .eq("id", id);

    if (error) {
      throw error;
    }

    res.json({ message: "Successfully updated task." });
  } catch (error) {
    return res.status(500).json({ error: error.message ?? error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: "Successfully deleted task." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.reorderTask = async (req, res) => {
  try {
    const {
      data: { id, upper_position, lower_position },
    } = req.body;

    let newPosition;
    // should alwways be the latest position
    const lowerPosition = Number(lower_position);
    const upperPosition = Number(upper_position);

    // check if upper and lower position's are too close
    if (upperPosition - lowerPosition < 1) {
      const { data, error } = await supabase.rpc("rebalance_task_positions");

      //alternative/ improvement: flag rebalancing operation and create a scheduled/bakcground process insetad
      if (error) {
        throw error;
      }
    }

    const GAP = 10000;

    if (lowerPosition === 0 && upperPosition) {
      newPosition = upperPosition / 2;
    } else if (upperPosition === 0 && lowerPosition) {
      newPosition = lowerPosition + GAP;
    } else if (upperPosition > 0 && lowerPosition > 0) {
      newPosition = (lowerPosition + upperPosition) / 2;
    } else {
      throw new Error("Invalid position bounds");
    }

    if (isNaN(newPosition)) {
      throw new Error("Invalid position value.");
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({ position: newPosition })
      .eq("id", id);

    if (error) {
      throw error;
    }

    res.status(200).json({
      message: "Successfully updated position.",
      data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message ?? error });
  }
};

// get random task
exports.getRandomTask = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc("get_random_id");

    if (error) {
      throw error;
    }
    res.json({ data: { id: data } });
  } catch (error) {
    return res.status(500).json({ error: error.message ?? error });
  }
};

exports.getRandomConsecutiveTasks = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc("get_consecutive_tasks");

    if (error) {
      throw error;
    }
    res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message ?? error });
  }
};

module.exports = exports;
