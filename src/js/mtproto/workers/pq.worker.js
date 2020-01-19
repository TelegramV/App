import PQ from "../utils/pq"

self.addEventListener("message", event => {
    const eventData = event.data

    const task = eventData.task
    const taskId = eventData.taskId
    const taskData = eventData.taskData

    let result = null

    if (task === "decomposePQ") {
        result = PQ.decompose(taskData.pq)
    }

    postMessage({taskId: taskId, taskResult: result})
})

postMessage("ready")
