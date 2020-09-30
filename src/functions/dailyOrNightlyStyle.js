function dailyOrNightly() {

    const d = new Date().getHours();

    return ((d >= 6) && (d < 18)) ? 'daily' : 'nightly';
}

export default dailyOrNightly;