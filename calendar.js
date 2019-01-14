'use strict';

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

function startOfWeek(year, month, day) {
	let date = new Date(year, month-1, day);
	let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

function weeksOfTheMonth(year, month) {
  let weeks = [];
  for(var i=0;i<6;i++) {
  	let startWeek = startOfWeek(year, month, 7*i);
    let datesOfWeeks = [];
    datesOfWeeks.push( startWeek );
    for(var j=1;j<=6;j++) {
    	let date = new Date(startWeek.getFullYear(), startWeek.getMonth(), startWeek.getDate()+j);
      datesOfWeeks.push( date );
    }
    
    if( i == 0 ) {
    	weeks.push( datesOfWeeks );
    } else {
      let dateFlag = datesOfWeeks[0];
    	let yearFlag = dateFlag.getFullYear();
      let monthFlag = dateFlag.getMonth();
      if( year === yearFlag && (month-1) === monthFlag ) {
      	weeks.push( datesOfWeeks );
      }
    }
      	
  }
	return weeks;
}

class Dia extends React.Component {

    render() {
        return (
            <td>{this.props.dia.getDate()}</td>
        );
    }

}

class Semana extends React.Component {
    
    renderDias() {
        let dias = [];
        for(let i=0;i<this.props.dias.length;i++) {
            let dia = this.props.dias[i];
            dias.push(
                <Dia dia={dia}/>
            );
        }
        return dias;
    }

    render() {
        return (
            <tr>
                {this.renderDias()}
            </tr>
        );
    }

}

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ano: 2019,
            mes: 1
        };
    }

    renderSemanas() {

        let weeksToRender = [];
        let semanas = weeksOfTheMonth(this.state.ano, this.state.mes);

        for(let i=0;i<semanas.length;i++) {
            let semana = semanas[i];
            weeksToRender.push(
                <Semana 
                    ano={this.state.ano} 
                    mes={this.state.mes} 
                    dias={semana} 
                />
            );
        }

        return weeksToRender;
    }

    mesAnterior() {
        let date = new Date(this.state.ano, this.state.mes - 1, 1);
        //console.log('mesAnterior antes', date, this.state);
        date.addMonths(-1);
        this.setState({
            ano: date.getFullYear(),
            mes: date.getMonth() + 1
        }, function() {
            console.log('mesAnterior', date, this.state);
        });
    }

    proximoMes() {
        let date = new Date(this.state.ano, this.state.mes - 1, 1);
        //console.log('proximoMes antes', date, this.state);
        date.addMonths(1);
        this.setState({
            ano: date.getFullYear(),
            mes: date.getMonth() + 1
        }, function(){
            console.log('proximoMes', date, this.state);
        });
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
                                <th>Segunda</th>
                                <th>Ter&ccedil;a</th>
                                <th>Quarta</th>
                                <th>Quinta</th>
                                <th>Sexta</th>
                                <th>S&aacute;bado</th>
                                <th>Domingo</th>
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
    <Calendar />,
    document.getElementById('root')
);
