# -*- coding: utf-8 -*-
  #===========================================================================
  ${self.title()}:
  #===========================================================================
    metaData:
      title: '<%text>$</%text>{title}'

    #-------------------------------------------------------------------------
    mainPage:
      pageSize: A4
      backgroundPdf: '<%text>$</%text>{configDir}/tpl_puidoux_A4_landscape.pdf'
      landscape: true
      rotation: true
      items:
        - !map
          condition: showMap
          width: 813
          height: 415
          absoluteX: 15
          absoluteY: 500
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
          absoluteY: 452
          width: 100
          items:
            - !image
              align: center
              maxWidth: 49
              url: '<%text>$</%text>{configDir}/north.png'
              rotation: '<%text>$</%text>{rotation}'
        # update label
        - !columns
          absoluteX: 760
          absoluteY: 520
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
        #- !columns
        #  absoluteX: 785
        #  absoluteY: 520
        #  width: 51
        #  config:
        #    borderWidthTop: 0
        #    cells:
        #      - padding: 5
        #        paddingTop: 9
        #  items:
        #    - !text
        #      text: '<%text>$</%text>{now dd.MM.yyyy}'
        #      fontSize: 6
        # Title
        - !columns
          absoluteX: 43
          absoluteY: 520
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
          absoluteY: 505
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
          absoluteX: 750
          absoluteY: 600
          width: 118
          config:
            cells:
              - padding: 8
                paddingTop: 75
          items:
            - !text
              text: 'Echelle 1:<%text>$</%text>{scale}'
              fontSize: 10
        ## Border
        #- !columns
        #  absoluteX: 51
        #  absoluteY: 116
        #  width: 511
        #  config:
        #    borderWidth: 0.8
        #    borderWidthTop: 0
        #    cells:
        #      - padding: 39
        #  items:
        #    - !text
        #      text: ' '
    lastPage:
      pageSize: A4
      items:
          - !columns
            condition: legends
            absoluteX: 51
            absoluteY: 808
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
            absoluteY: 780
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

#    lastPage:
#      pageSize: A4
##      backgroundPdf: '<%text>$</%text>{configDir}/tpl_puidoux.pdf'
#      marginTop: 150
#      items:
#        - !text
#          align:left
#          text: 'LEGENDE'
#          spacingAfter: 10
#        - !legends
##         backgroundColor is needed because the yaml parser needs at least one parameter otherwise it causes an error
#          backgroundColor: white
#        - !table
#          absoluteY: 84
#          absoluteX: 188
#          width: 365
#          nbColumns: 2
#          widths: [325,40]
#          config:
#            borderWidth: 0.5
#            borderColor: black
#            cells:
#              - col: 1
#                paddingTop: 25
#                paddingBottom: 25
#                align: center
#                borderWidthLeft: 0.5
#          items:
#            - !table
#              nbColumns: 1
#              config:
#                cells:
#                  - padding: 4
#                  - row: 0
#                    align: center
#                    borderWidthBottom: 0.5
#              items:
#                - !text
##                  condition: mapTitleOn
#                  fontSize: 10
#                  text: '<%text>$</%text>{title}'
##                - !text
##                  condition: !mapTitleOn
##                  text: ''
#                - !text
##                  condition: comment
#                  fontSize: 10
#                  text: '<%text>$</%text>{comment}'
#            - !text
#              fontSize: 10
#              text: 'Page <%text>$</%text>{pageNum}'

## the backslash tell mako To Not write a new line at the end
<%def name="title()">\
3 A4 landscape\
</%def>

<%def name="block_logo()">
            - !text
              text: 'Put your logo here'
              fontSize: 6
</%def>

<%def name="block_text_misc()">
            - !text
              text: 'Here some miscellaneous text'
              fontSize: 6
</%def>
