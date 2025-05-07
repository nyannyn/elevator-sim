class Controls {
    private readonly p: any;
    private readonly settings: any;
    private stats: any;
    private readonly activeCarsChange: () => void;
    private paymentsChart: any;

    constructor(p, settings, stats) {
        this.p = p;
        this.settings = settings;
        this.stats = stats;
        this.activeCarsChange = () => {};
    }

    createKnobs(passengerLoadTypes) {
        const p = this.p;
        const settings = this.settings;

        const elevSpeed = p.select('#elevSpeed');
        const elevSpeedValue = p.select('#elevSpeedValue');
        elevSpeed.value(settings.elevSpeed);
        elevSpeedValue.html(elevSpeed.value());
        elevSpeed.input(() => {
            settings.elevSpeed = elevSpeed.value();
            elevSpeedValue.html(elevSpeed.value());
        });

        const numCars = p.select('#numActiveCars');
        const numCarsValue = p.select('#numActiveCarsValue');
        numCars.value(settings.numActiveCars);
        numCarsValue.html(numCars.value());
        numCars.input(() => {
            settings.numActiveCars = numCars.value();
            numCarsValue.html(numCars.value());
            this.activeCarsChange();
        });

        const volume = p.select('#volume');
        const volumeValue = p.select('#volumeValue');
        volume.value(settings.volume);
        volumeValue.html(volume.value());
        volume.input(() => {
            if (p.getAudioContext().state !== 'running') {
              p.getAudioContext().resume();
            }
            settings.volume = volume.value();
            volumeValue.html(volume.value());
            p.dingSound.setVolume(volume.value() / 100);
        });

        const projection = p.createSelect();
        ['Perspective', 'Orthographic'].forEach(p => projection.option(p));
        projection.parent('#projectionParent');
        projection.changed(() => settings.projectionType = projection.elt.selectedIndex);

        const controlMode = p.createSelect();
        ['Auto', 'Manual'].forEach(p => controlMode.option(p));
        controlMode.parent('#controlModeParent');
        controlMode.changed(() => settings.controlMode = controlMode.elt.selectedIndex);

        const view = p.createSelect();
        ['Front', 'Side', 'Use Mouse'].forEach(v => view.option(v));
        view.parent('#viewParent');
        view.changed(() => settings.view = view.elt.selectedIndex);

        const passengerLoad = p.createSelect();
        passengerLoadTypes.forEach(o => passengerLoad.option(o));
        passengerLoad.parent('#passengerLoadParent');
        passengerLoad.changed(() => settings.passengerLoad = passengerLoad.elt.selectedIndex);

        this.paymentsChart = p.createGraphics(this.stats.maxRecentRiderPayments,
            15).parent('#paymentsChart');
        $('#paymentsChart canvas').show();
        
        const speakers = p.createSelect();
        ['None', 'All', 'Native English'].forEach(p => speakers.option(p));
        speakers.parent('#speakersParent');
        speakers.changed(() => settings.speakersType = speakers.elt.selectedIndex);

        const numFloors = p.select('#numFloors');
        const numFloorsValue = p.select('#numFloorsValue');
        numFloors.value(settings.numFloors || 6);
        numFloorsValue.html(numFloors.value());
        numFloors.input(() => {
            settings.numFloors = numFloors.value();
            numFloorsValue.html(numFloors.value());
            // 重新计算画布大小以适应新的楼层数
            const newHeight = settings.geom.storyHeight * settings.numFloors;
            settings.geom.canvas.y = Math.max(newHeight, p.windowHeight * 0.92);
            p.resizeCanvas(settings.geom.canvas.x, settings.geom.canvas.y);
        });
    }
}
