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

class DayOfWeek extends React.Component {

    render() {
        return (
            <td>{this.props.date.getDate()}</td>
        );
    }

}

class Week extends React.Component {
    
    renderDays() {
        let days = [];
        for(let i=0;i<this.props.days.length;i++) {
            let day = this.props.days[i];
            days.push(
                <DayOfWeek date={day}/>
            );
        }
        return days;
    }

    render() {
        return (
            <tr>
                {this.renderDays()}
            </tr>
        );
    }

}

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: 2019,
            month: 1
        };
    }

    renderWeeks() {

        let weeksToRender = [];
        let weeks = weeksOfTheMonth(this.state.year, this.state.month);

        for(let i=0;i<weeks.length;i++) {
            let week = weeks[i];
            weeksToRender.push(
                <Week 
                    days={week} 
                />
            );
        }

        return weeksToRender;
    }

    previousMonth() {
        let date = new Date(this.state.year, this.state.month - 1, 1);
        
        date.addMonths(-1);
        this.setState({
            year: date.getFullYear(),
            month: date.getMonth() + 1
        }, function() {
            console.log('previousMonth', date, this.state);
        });
    }

    nextMonth() {
        let date = new Date(this.state.year, this.state.month - 1, 1);
        
        date.addMonths(1);
        this.setState({
            year: date.getFullYear(),
            month: date.getMonth() + 1
        }, function(){
            console.log('nextMonth', date, this.state);
        });
    }

    monthYear() {
        return this.state.month + '/' + this.state.year;
    }

    render() {

        return (

            <div class="col-sm-12">


                <div class="row">
                    <div class="col-md-12">
                        <div class="btn-group">
                            <a href="javascript:;" onClick={this.previousMonth.bind(this)} class="btn btn-default btn-sm">
                                <i class="glyphicon glyphicon-chevron-left"></i>
                            </a>
                            <a disabled class="btn btn-default btn-sm">
                                {this.monthYear()}
                            </a>
                            <a href="javascript:;" onClick={this.nextMonth.bind(this)} class="btn btn-default btn-sm">
                                <i class="glyphicon glyphicon-chevron-right"></i>
                            </a>
                        </div>
                    </div>
                </div>


                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Monday</th>
                                <th>tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>
                                <th>Sunday</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderWeeks()}
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
