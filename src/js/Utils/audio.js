export function largestTriangleThreeBuckets(data, threshold) {
    const data_length = data.length
    if (threshold >= data_length || threshold === 0) {
        return data;
    }
    let sampled = [],
        sampled_index = 0

    const every = (data_length - 2) / (threshold - 2)

    let a = 0,
        max_area_point,
        max_area,
        area,
        next_a

    sampled[sampled_index++] = data[a];

    for (let i = 0; i < threshold - 2; i++) {
        let avg_x = 0,
            avg_y = 0,
            avg_range_start = Math.floor((i + 1) * every) + 1,
            avg_range_end = Math.floor((i + 2) * every) + 1
        avg_range_end = avg_range_end < data_length ? avg_range_end : data_length;

        const avg_range_length = avg_range_end - avg_range_start

        for (; avg_range_start < avg_range_end; avg_range_start++) {
            avg_x += avg_range_start;
            avg_y += data[avg_range_start] * 1;
        }

        avg_x /= avg_range_length;
        avg_y /= avg_range_length;

        let range_offs = Math.floor((i + 0) * every) + 1,
            range_to = Math.floor((i + 1) * every) + 1

        var point_a_x = a * 1,
            point_a_y = data[a] * 1;

        max_area = area = -1;

        for (; range_offs < range_to; range_offs++) {
            area = Math.abs((point_a_x - avg_x) * (data[range_offs] - point_a_y) -
                (point_a_x - range_offs) * (avg_y - point_a_y)
            ) * 0.5;
            if (area > max_area) {
                max_area = area;
                max_area_point = data[range_offs];
                next_a = range_offs;
            }
        }

        sampled[sampled_index++] = max_area_point;
        a = next_a;
    }

    sampled[sampled_index++] = data[data_length - 1];
    return sampled;
}

function average(data) {
    const sum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);

    return sum / data.length;
}

export function smooth(values, alpha) {
    const weighted = average(values) * alpha
    const smoothed = []
    for (const i in values) {
        const curr = values[i]
        const prev = smoothed[i - 1] || values[values.length - 1]
        const next = curr || values[0]
        const improved = Number(average([weighted, prev, curr, next]).toFixed(2))
        smoothed.push(improved);
    }
    return smoothed;
}