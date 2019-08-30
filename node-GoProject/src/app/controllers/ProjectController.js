var projects = []

class ProjectController {
    async store(req, res) {
        projects.push(req.body)
        return res.json(projects);
    }

    async index(req, res) {
        return res.json(projects);
    }

    async update(req, res) {
        const { id } = req.params;
        const { title } = req.body;

        projects.map(function (p) {
            if (p["id"] === id.toString()) {
                p["title"] = title
            }
            return p;
        });

        return res.json(projects);
    }

    async delete(req, res) {
        const { id } = req.params;
        let isDeleted = false;

        var filtered = projects.filter(function (proj, index, arr) {
            if (proj["id"] === id.toString()) {
                isDeleted = true;
                return false;
            }
            return true;
        });

        projects = filtered;

        if (isDeleted) {
            return res.json({ message: "Mensagem deletada!" });
        } else {
            return res.status(404).json({
                error: "Mensagem não encontrada",
            });
        }

    }

    async addTask(req, res) {
        const { id } = req.params;
        const { title } = req.body;
        const project = projects.find(p => p.id == id);
        project.tasks.push(title);
        return res.json(project);
    }
}

export default new ProjectController();

/**
 *
 * var filtered = array.filter(function(value, index, arr){

    return value > 5;

});
 */