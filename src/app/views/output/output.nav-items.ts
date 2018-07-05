const outputChart = localStorage.getItem('outputChart');
// console.log(outputChart);
if (outputChart != null) {
    this.productChartNav = [
        {
            name: 'Preliminary',
            url: '/output/preliminary',
            icon: '',
        },
        {
            name: 'Sizing',
            url: '/output/sizing',
            icon: '',
        },
        {
            name: 'Product charts',
            url: '/output/charts',
            icon: '',
        }
    ];
} else {
    this.productChartNav = [
        {
            name: 'Preliminary',
            url: '/output/preliminary',
            icon: '',
        },
        {
            name: 'Sizing',
            url: '/output/sizing',
            icon: '',
        },
        {
            name: 'Product charts',
            url: '/output/charts',
            icon: '',
        }
    ];
}
export const OutputNavItems = this.productChartNav;
