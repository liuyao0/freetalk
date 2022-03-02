function changeHTMLToText(content) {
    return content
        .replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
        .replace(/<br\/?>/gi, '\n')
        .replace(/<[^>/]+>/g, '')
        .replace(/(\n)?<\/([^>]+)>/g, '')
        .replace(/\u00a0/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/<\/?(img)[^>]*>/gi, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/<\/?.+?>/g, '');
}
export {changeHTMLToText}

export function getDateTime(nS) {
    let date = new Date(nS);
    return date.getFullYear()
        + "-"
        + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
            + (date.getMonth() + 1))
        + "-"
        + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
        + " "
        + (date.getHours() < 10 ? "0" + date.getHours() : date
            .getHours())
        + ":"
        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
            .getMinutes());
}
