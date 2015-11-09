define(['AdaptiveMindView', 'text!templates/profile.html'],
function(AdaptiveMindView, indexTemplate) {
    var indexView = AdaptiveMindView.extend ({
      el: $('#content'),

      initialize: function (){
        this.student = ""; 
      },

      getMyMatches: function (students){
        console.log("YES WORKING",students);
            var that = this; 
            var studentsGeneralMatches = that.rearrange(students.matches.bestGeneral); 
            var studentsGradeMatches = that.rearrange(students.matches.bestGrade); 
            var studentsWorstMatches = that.rearrange(students.matches.worstGeneral); 
            var studentsWorstGradeMatches = that.rearrange(students.matches.worstGrade); 

            for ( var i = 0; i < 10; i++){
// ***********************************************************************************************
              var selectedStudent = studentsGeneralMatches[i]; 
              if ( selectedStudent != null ) {
                var html = "<li class='list-group-item'  > <p class='up'>" 
                + selectedStudent.firstName + " "+ selectedStudent.lastName + " | "
                + selectedStudent.grade + "</p>" 
                + "<div id='general"+i+"'></div>";
                $("#bestGeneral").append(html);
                var id = "#general"+i;
                that.visual(Math.round(selectedStudent.percentage), id ); 
              }
// ***********************************************************************************************
               selectedStudent = studentsGradeMatches[i]; 
              if ( selectedStudent != null ) {
                var html = "<li class='list-group-item'  > <p class='up'>" 
                + selectedStudent.firstName + " "+ selectedStudent.lastName + "</p>" 
                + "<div id='grade"+i+"'></div>";
                $("#bestGrade").append(html);
                var id = "#grade"+i;
                that.visual(Math.round(selectedStudent.percentage), id ); 
              }
// ***********************************************************************************************
               selectedStudent = studentsWorstMatches[i]; 
              if ( selectedStudent != null ) {
                var html = "<li class='list-group-item'  > <p class='up'>" 
                + selectedStudent.firstName + " "+ selectedStudent.lastName + " | "
                + selectedStudent.grade + "</p>" 
                + "<div id='worst"+i+"'></div>";
                $("#worstGeneral").append(html);
                var id = "#worst"+i;
                that.visual(Math.round(selectedStudent.percentage), id ); 
              }
// ***********************************************************************************************
               selectedStudent = studentsWorstGradeMatches[i]; 
              if ( selectedStudent != null ) {
                var html = "<li class='list-group-item'  > <p class='up'>" 
                + selectedStudent.firstName + " "+ selectedStudent.lastName + " | "
                + selectedStudent.grade + "</p>" 
                + "<div id='worstGrade"+i+"'></div>";
                $("#worstGrade").append(html);
                var id = "#worstGrade"+i;
                that.visual(Math.round(selectedStudent.percentage), id ); 
              }
            }
      },

      visual: function (percentage , id){
          var chart,
          width = percentage,
          bar_height = 20,
          height = 30, 
          barSize = percentage + "%",
          left_width = 100;


          chart = d3.select(id) 
            .append('svg')
            .attr('class', 'chart')
            .attr('width', "100%")
            .attr('height', height);

          var x, y;
          x = d3.scale.linear()
             .domain([0, 100])
             .range([0, width]);

          y = d3.scale.ordinal()
             .domain(percentage)
             .rangeBands([0, height]);

          chart.selectAll("rect")
             .data([percentage])
             .enter().append("rect")

             .attr("x", 0)
             .attr("y", 0)
             .attr("width", barSize)
             .attr("height", height);


          chart.selectAll("text")
              .data([percentage])
              .enter()
              .append("text")
              .attr("x", function(d) { return x(d) +29; })
              .attr("y", function(d){ return 15 ; } )
              .text( function (d) { return percentage+ "%"; } )
              .attr("dx", -5)
              .attr("dy", ".36em"); 

      },

      rearrange: function (selectedStudent){
        selectedStudent.sort(function(a, b){
            var nameA=a.percentage, nameB=b.percentage;
             if (nameA < nameB) //sort string ascending
              return 1; 
             if (nameA > nameB)
              return -1;
             return 0; //default return value (no sorting)        
        }); 
        return selectedStudent; 
      },

      render: function() {
        var that = this;
        var id = (window.location.hash).substring(9 ,window.location.hash.length);
        $.ajax("/profile/"+id, {
          method: "GET", 
          success: function(data) {
            that.student = data; 
            that.$el.html(_.template(indexTemplate, that.student ));
            that.getMyMatches(that.student); 
          },
          error: function(data) {
            window.location.hash = '#';
          }
        });
      }//render

    }); 
    
    return indexView;
});


