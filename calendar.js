'use strict';

Date.prototype.getWeekOfTheYear = function () {

    // Create a copy of this date object  
    var target = new Date(this.valueOf());

    // ISO week date weeks start on monday, so correct the day number  
    var dayNr = (this.getDay() + 6) % 7;

    // Set the target to the thursday of this week so the  
    // target date is in the right year  
    target.setDate(target.getDate() - dayNr + 3);

    // ISO 8601 states that week 1 is the week with january 4th in it  
    var jan4 = new Date(target.getFullYear(), 0, 4);

    // Number of days between target date and january 4th  
    var dayDiff = (target - jan4) / 86400000;

    if (new Date(target.getFullYear(), 0, 1).getDay() < 5) {
        // Calculate week number: Week 1 (january 4th) plus the    
        // number of weeks between target date and january 4th    
        return 1 + Math.ceil(dayDiff / 7);
    }
    else {  // jan 4th is on the next week (so next week is week 1)
        return Math.ceil(dayDiff / 7);
    }
};

Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

class Dia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dia: props.dia
        }
        console.log('dia', this.state.dia);
    }

    render() {
        return (
            <td>X</td>
        );
    }

}

class Semana extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ano: props.ano,
            mes: props.mes,
            semana: props.semana
        }
        console.log('semana', this.state);
    }

    diaInicio = () => {



    }

    render() {
        return (
            <tr>
                <Dia />
                <Dia />
                <Dia />
                <Dia />
                <Dia />
                <Dia />
                <Dia />
            </tr>
        );
    }

}

class CalendarioDiario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ano: 2019,
            mes: 1
        };
    }

    getWeekStart = (year, month_number) => {

        // month_number is in the range 1..12

        let inicioMes = new Date(year, month_number - 1, 1);

        let week = inicioMes.getWeekOfTheYear();

        return week;
    }

    getWeekEnd = (year, month_number) => {

        // month_number is in the range 1..12

        let fimMes = new Date(year, month_number, 0);

        let week = fimMes.getWeekOfTheYear();

        console.log('fimMes:', fimMes, 'week:', week);

        return week;
    }

    renderSemanas() {

        let semanas = [];

        const weekStart = this.getWeekStart(this.state.ano, this.state.mes);
        const weekEnd = this.getWeekEnd(this.state.ano, this.state.mes);

        console.log(this.state.mes + '/' + this.state.ano, 'weekStart:', weekStart, 'weekEnd:', weekEnd);

        for (let i = weekStart; i <= weekEnd; i++) {
            semanas.push(
                <Semana ano={this.state.ano} mes={this.state.mes} semana={i} />
            );
        }

        return semanas;
    }

    mesAnterior() {
        let date = new Date(this.state.ano, this.state.mes - 1, 1);
        //console.log('mesAnterior antes', date, this.state);
        date.addMonths(-1);
        this.setState({
            ano: date.getFullYear(),
            mes: date.getMonth() + 1
        });
        //console.log('mesAnterior', date, this.state);
    }

    proximoMes() {
        let date = new Date(this.state.ano, this.state.mes - 1, 1);
        //console.log('proximoMes antes', date, this.state);
        date.addMonths(1);
        this.setState({
            ano: date.getFullYear(),
            mes: date.getMonth() + 1
        });
        //console.log('proximoMes', date, this.state);
    }

    mesAno() {
        return this.state.mes + '/' + this.state.ano;
    }

    render() {

        return (

            <div class="col-sm-12">


                <div class="row">
                    <div class="col-md-12">
                        <div class="btn-group">
                            <a href="javascript:;" onClick={this.mesAnterior.bind(this)} class="btn btn-default btn-sm">
                                <i class="glyphicon glyphicon-chevron-left"></i>
                            </a>
                            <a disabled class="btn btn-default btn-sm">
                                {this.mesAno()}
                            </a>
                            <a href="javascript:;" onClick={this.proximoMes.bind(this)} class="btn btn-default btn-sm">
                                <i class="glyphicon glyphicon-chevron-right"></i>
                            </a>
                        </div>
                    </div>
                </div>


                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Domingo</th>
                                <th>Segunda</th>
                                <th>Ter&ccedil;a</th>
                                <th>Quarta</th>
                                <th>Quinta</th>
                                <th>Sexta</th>
                                <th>S&aacute;bado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderSemanas()}
                        </tbody>
                    </table>
                </div>


            </div>

        );
    }
}

ReactDOM.render(
    <CalendarioDiario />,
    document.getElementById('root')
);
