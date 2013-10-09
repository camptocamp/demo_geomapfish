# -*- coding: utf-8 -*-
  #===========================================================================
  ${self.title()}:
  #===========================================================================
    metaData:
      title: '<%text>$</%text>{title}'

    #-------------------------------------------------------------------------
    mainPage:
      pageSize: A3
      ${self.backgroundPdf()} 
      rotation: true
      items:
        - !map
          condition: showMap
          width: 810
          height: 990
          absoluteX: 15
          absoluteY: 1085
        - !columns
          condition: showAttr
          absoluteX: 61
          absoluteY: 808
          width: 491
          config:
              borderWidth: 0
              borderColor: black
          items:
            - !attributes
              source: table
              tableConfig: 
                cells: 
                  - padding: 2
                    backgroundColor: #ffffff
                    borderWidthRight: 0
                    borderWidthBottom: 0
                    borderColor: black  
              columnDefs:
                col0:
                  header: !text
                    text: '<%text>$</%text>{col0}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col0}'
                        fontSize: 8
                        backgroundColor: #ffffff
                        borderColorBottom: #ffffff
                        borderWidthBottom: 1
                col1:
                  header: !text
                    text: '<%text>$</%text>{col1}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col1}'
                        fontSize: 8
                        backgroundColor: #ffffff
                col2:
                  header: !text
                    text: '<%text>$</%text>{col2}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col2}'
                        fontSize: 8
                        backgroundColor: #ffffff
                col3:
                  header: !text
                    text: '<%text>$</%text>{col3}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col3}'
                        fontSize: 8
                        backgroundColor: #ffffff
                col4:
                  header: !text
                    text: '<%text>$</%text>{col4}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col4}'
                        fontSize: 8
                        backgroundColor: #ffffff
                col5:
                  header: !text
                    text: '<%text>$</%text>{col5}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col5}'
                        fontSize: 8
                        backgroundColor: #ffffff
                col6:
                  header: !text
                    text: '<%text>$</%text>{col6}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col6}'
                        fontSize: 8
                        backgroundColor: #ffffff
                col7:
                  header: !text
                    text: '<%text>$</%text>{col7}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col7}'
                        fontSize: 8
                        backgroundColor: #ffffff
                col8:
                  header: !text
                    text: '<%text>$</%text>{col8}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col8}'
                        fontSize: 8
                        backgroundColor: #ffffff
                col9:
                  header: !text
                    text: '<%text>$</%text>{col9}'
                    font: Helvetica-Bold
                    fontSize: 8
                    backgroundColor: #ffffff
                  cell: !columns
                    items:
                      - !text
                        text: '<%text>$</%text>{col9}'
                        fontSize: 8
                        backgroundColor: #ffffff
        - !columns
          condition: showNorth
          absoluteX: 715
          absoluteY: 1052
          width: 100
          items:
            - !image
              align: center
              maxWidth: 49
              url: '<%text>$</%text>{configDir}/north.png'
              rotation: '<%text>$</%text>{rotation}'
        - !columns
          absoluteX: 760
          absoluteY: 1120
          width: 106
          config:
            borderWidthTop: 0
            cells:
              - padding: 5
                paddingTop: 9
          items:
            - !text
              text: 'Puidoux, le <%text>$</%text>{now dd.MM.yyyy}'
              fontSize: 6
        # Date
        - !columns
          absoluteX: 720
          absoluteY: 1100
          width: 51
          config:
            borderWidthTop: 0
            cells:
              - padding: 5
                paddingTop: 9
          items:
            - !text
              text: '<%text>$</%text>{now dd.MM.yyyy}'
              fontSize: 6
        # Title
        - !columns
          absoluteX: 43
          absoluteY: 720
          width: 618
          config:
            cells:
              - padding: 8
          items:
            - !text
              text: '<%text>$</%text>{title}'
              fontSize: 10
        # Comment
        - !columns
          absoluteX: 43
          absoluteY: 705
          width: 618
          config:
            cells:
              - padding: 8
          items:
            - !text
              text: '<%text>$</%text>{comment}'
              fontSize: 7
        # Scale
        - !columns
          condition: showScalevalue
          absoluteX: 755
          absoluteY: 1200
          width: 118
          config:
            cells:
              - padding: 8
                paddingTop: 75
          items:
            - !text
              text: 'Echelle 1:<%text>$</%text>{scale}'
              fontSize: 10
    lastPage:
      pageSize: A4
      items:
        - !columns
          condition: legends
          absoluteX: 51
          absoluteY: 700
          width: 511
          backgroundColor: #FF0000
          items:
            - !text
              align:left
              text: 'Légende'
              spacingAfter: 10
        - !columns
          condition: legends
          absoluteX: 51
          absoluteY: 680
          width: 400
          backgroundColor: #FF0000
          items:
            - !legends
              inline: false
              defaultScale: 0.5
              maxHeight: 550
              maxWidth: 50
              iconMaxHeight: 0
              iconMaxWidth: 0
              horizontalAlignment: left
              columnMargin: 5
              classIndentation: 3
              classSpace: 5
              layerSpace: 5
              backgroundColor: white

## the backslash tell mako To Not write a new line at the end
<%def name="title()">\
2 A3 portrait\
</%def>
