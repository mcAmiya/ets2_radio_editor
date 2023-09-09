import moment from 'moment'
import CryptoJS from 'crypto-js'

function decodeUnicode(str) {
    // 判断字符串中是否包含 %
    if (str.includes('%')) {
        return str; // 如果包含 %，则直接返回原始数据
    }

    // 将 \\x 替换成 %
    const encodedStr = str.replace(/\\x/g, '%');
    // 使用 decodeURIComponent 进行解码
    return decodeURIComponent(encodedStr);
}

function parseRadioData(data) {
    const regexNameless = /live_stream_def\s*:\s*([^{\n]+)/;
    const namelessMatch = regexNameless.exec(data);
    const namelessField = namelessMatch ? namelessMatch[1].trim() : '';

    const regex = /stream_data\[\d+]:\s*"([^"]+)"/g;
    const stations = [];
    let match;

    while ((match = regex.exec(data)) !== null) {
        const stationData = match[1];
        const station = {
            url: decodeUnicode(stationData.split("|")[0]), // 对 URL 进行转义
            name: decodeUnicode(stationData.split("|")[1]), // 对电台名称进行转义
            genre: decodeUnicode(stationData.split("|")[2]), // 对类型进行转义
            country: decodeUnicode(stationData.split("|")[3]), // 对国家进行转义
            bitrate: parseInt(stationData.split("|")[4]),
            liked: parseInt(stationData.split("|")[5]) === 1,
        };
        stations.push(station);
    }

    return {namelessField, stations};
}

function createRadioData(stations) {
    let namelessField = '.live_streams'
    let data = `SiiNunit\n{\n  live_stream_def : ${namelessField} {\n    stream_data: ${stations.length}\n`;
    for (let i = 0; i < stations.length; i++) {
        const station = stations[i];
        const encodedName = (station.name);
        const encodedGenre = (station.genre);
        const encodedCountry = (station.country);
        data += `    stream_data[${i}]: "${station.url}|${encodedName}|${encodedGenre}|${encodedCountry}|${station.bitrate}|${station.liked ? 1 : 0}"\n`;
    }
    data += '  }\n}';

    return data;
}

function getLiveUrl(channel_id) {
    const t = "/live/" + channel_id + "/64k.mp3", n = 'https://lhttp.qtfm.cn',
        r = encodeURIComponent(moment().add(1, "weeks").unix().toString(16)),
        i = encodeURIComponent("web"),
        a = "app_id=" + i + "&path=" + encodeURIComponent(t) + "&ts=" + r,
        o = CryptoJS.HmacMD5(a, "Lwrpu$K5oP").toString(CryptoJS.enc.Hex);
    return "" + n + t + "?app_id=" + i + "&ts=" + r + "&sign=" + encodeURIComponent(o)
}

export default {
    parseRadioData,
    createRadioData,
    getLiveUrl
}