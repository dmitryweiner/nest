object Form1: TForm1
  Left = 14
  Top = 2
  BorderIcons = [biSystemMenu, biMinimize]
  BorderStyle = bsSingle
  Caption = 'Nest v. 7.3.1'
  ClientHeight = 540
  ClientWidth = 774
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  OldCreateOrder = False
  OnClose = FormClose
  OnCreate = FormCreate
  OnShow = FormShow
  PixelsPerInch = 96
  TextHeight = 13
  object PageControl1: TPageControl
    Left = 0
    Top = 0
    Width = 774
    Height = 500
    ActivePage = TabSheet1
    Align = alClient
    Enabled = False
    TabOrder = 0
    object TabSheet1: TTabSheet
      Caption = 'TabSheet1'
      object GroupBox1: TGroupBox
        Left = 0
        Top = 0
        Width = 225
        Height = 472
        Align = alLeft
        Caption = #1042#1093#1086#1076#1085#1099#1077' '#1076#1072#1085#1085#1099#1077':'
        TabOrder = 0
        object Label3: TLabel
          Left = 32
          Top = 464
          Width = 80
          Height = 13
          Caption = #1057#1095#1080#1090#1072#1090#1100' '#1087#1077#1088#1074#1099#1093
        end
        object RGtype: TRadioGroup
          Left = 8
          Top = 16
          Width = 209
          Height = 81
          Caption = #1058#1080#1087' '#1076#1072#1085#1085#1099#1093
          ItemIndex = 0
          Items.Strings = (
            #1061'<'#1087#1088#1086#1073#1077#1083'>'#1059
            'N('#1085#1086#1084#1077#1088' '#1075#1085#1077#1079#1076#1072')<>X<>Y'
            'N<>Date('#1076#1072#1090#1072' '#1086#1089#1085#1086#1074#1072#1085#1080#1103')<>X<>Y')
          TabOrder = 0
        end
        object ListBox1: TListBox
          Left = 8
          Top = 128
          Width = 209
          Height = 261
          ItemHeight = 13
          TabOrder = 1
        end
        object Bloadbuff: TButton
          Left = 8
          Top = 396
          Width = 209
          Height = 53
          Caption = #1047#1072#1075#1088#1091#1079#1080#1090#1100' '#1076#1072#1085#1085#1099#1077' '#1080' '#1085#1072#1095#1072#1090#1100' '#1088#1072#1073#1086#1090#1072#1090#1100
          Font.Charset = DEFAULT_CHARSET
          Font.Color = clGreen
          Font.Height = -11
          Font.Name = 'MS Sans Serif'
          Font.Style = []
          ParentFont = False
          TabOrder = 2
          OnClick = BloadbuffClick
        end
        object Button2: TButton
          Left = 8
          Top = 104
          Width = 209
          Height = 17
          Caption = #1054#1095#1080#1089#1090#1080#1090#1100' '#1087#1072#1084#1103#1090#1100
          Font.Charset = DEFAULT_CHARSET
          Font.Color = clRed
          Font.Height = -11
          Font.Name = 'MS Sans Serif'
          Font.Style = [fsBold]
          ParentFont = False
          TabOrder = 3
          OnClick = Button2Click
        end
        object ComboBox1: TComboBox
          Left = 120
          Top = 460
          Width = 97
          Height = 21
          ItemHeight = 13
          TabOrder = 4
          Text = 'ComboBox1'
          Items.Strings = (
            '1'
            '2'
            '3'
            '4'
            '5'
            '6'
            '7')
        end
      end
      object GroupBox2: TGroupBox
        Left = 413
        Top = 0
        Width = 353
        Height = 472
        Align = alRight
        Caption = #1056#1072#1089#1089#1090#1086#1103#1085#1080#1103' '#1076#1086' '#1089#1086#1089#1077#1076#1077#1081':'
        TabOrder = 1
        object Img: TImage
          Left = 8
          Top = 56
          Width = 337
          Height = 401
        end
        object Label1: TLabel
          Left = 16
          Top = 468
          Width = 49
          Height = 13
          Caption = #1052#1072#1089#1096#1090#1072#1073':'
        end
        object TB1: TTrackBar
          Left = 8
          Top = 16
          Width = 337
          Height = 33
          Enabled = False
          Max = 100
          Min = 1
          Position = 1
          TabOrder = 0
          OnChange = TB1Change
        end
        object UpDown1: TUpDown
          Left = 72
          Top = 468
          Width = 17
          Height = 17
          TabOrder = 1
          OnClick = UpDown1Click
        end
        object Button1: TButton
          Left = 96
          Top = 468
          Width = 81
          Height = 17
          Caption = 'Default'
          TabOrder = 2
          OnClick = Button1Click
        end
      end
    end
    object TabSheet2: TTabSheet
      Caption = 'TabSheet2'
      ImageIndex = 1
      object Panel1: TPanel
        Left = 8
        Top = 16
        Width = 573
        Height = 429
        TabOrder = 0
        object Image1: TImage
          Left = 168
          Top = 16
          Width = 393
          Height = 329
        end
        object ListBox2: TListBox
          Left = 12
          Top = 16
          Width = 141
          Height = 401
          ItemHeight = 13
          TabOrder = 0
        end
        object Button3: TButton
          Left = 176
          Top = 384
          Width = 105
          Height = 29
          Caption = '<< '#1053#1072#1079#1072#1076
          TabOrder = 1
          OnClick = Button3Click
        end
        object Button4: TButton
          Left = 296
          Top = 384
          Width = 177
          Height = 29
          Caption = #1042#1099#1095#1080#1089#1083#1080#1090#1100' '#1089#1088#1077#1076#1085#1080#1077' '#1088#1072#1089#1089#1086#1103#1085#1080#1103' >>'
          TabOrder = 2
        end
        object TrackBar2: TTrackBar
          Left = 168
          Top = 352
          Width = 393
          Height = 25
          Max = 100
          Min = 1
          Position = 50
          TabOrder = 3
          OnChange = TrackBar2Change
        end
      end
    end
    object TabSheet3: TTabSheet
      Caption = 'TabSheet3'
      ImageIndex = 2
      object GroupBox4: TGroupBox
        Left = 0
        Top = 0
        Width = 589
        Height = 433
        Caption = #1057#1088#1077#1076#1085#1080#1077' '#1088#1072#1089#1089#1090#1086#1103#1085#1080#1103
        TabOrder = 0
        object Image2: TImage
          Left = 244
          Top = 28
          Width = 329
          Height = 309
          Hint = 
            #1052#1086#1078#1085#1086' '#1087#1077#1088#1077#1084#1077#1097#1072#1090#1100' '#1080#1079#1086#1073#1088#1072#1078#1077#1085#1080#1077'. '#1044#1083#1103' '#1101#1090#1086#1075#1086' '#1085#1072#1076#1086' '#1085#1072#1078#1072#1090#1100' '#1083#1077#1074#1091#1102' '#1082#1085#1086#1087#1082#1091 +
            ' '#1084#1099#1096#1080', '#1087#1077#1088#1077#1084#1077#1089#1090#1080#1090#1100' '#1084#1099#1096#1100' '#1080' '#1086#1090#1087#1091#1089#1090#1080#1090#1100' '#1082#1085#1086#1087#1082#1091'.'
          ParentShowHint = False
          ShowHint = True
          OnMouseDown = Image2MouseDown
          OnMouseMove = Image2MouseMove
          OnMouseUp = Image2MouseUp
        end
        object Label2: TLabel
          Left = 244
          Top = 404
          Width = 3
          Height = 13
          Font.Charset = DEFAULT_CHARSET
          Font.Color = clBlue
          Font.Height = -11
          Font.Name = 'MS Sans Serif'
          Font.Style = []
          ParentFont = False
        end
        object LB3: TListBox
          Left = 24
          Top = 28
          Width = 205
          Height = 365
          ItemHeight = 13
          TabOrder = 0
        end
        object Button6: TButton
          Left = 24
          Top = 400
          Width = 205
          Height = 25
          Caption = '<< '#1053#1072#1079#1072#1076
          TabOrder = 1
          OnClick = Button6Click
        end
        object GroupBox5: TGroupBox
          Left = 244
          Top = 344
          Width = 329
          Height = 49
          Caption = #1052#1072#1089#1096#1090#1072#1073
          TabOrder = 2
          object TrackBar3: TTrackBar
            Left = 12
            Top = 16
            Width = 309
            Height = 25
            Max = 200
            Min = 1
            Position = 100
            TabOrder = 0
            OnChange = TrackBar3Change
          end
        end
      end
    end
  end
  object StatusBar1: TStatusBar
    Left = 0
    Top = 500
    Width = 774
    Height = 20
    Panels = <>
    SimplePanel = True
  end
  object Panel2: TPanel
    Left = 0
    Top = 520
    Width = 774
    Height = 20
    Align = alBottom
    TabOrder = 2
    object Label4: TLabel
      Left = 8
      Top = 3
      Width = 506
      Height = 13
      Caption = 
        'Copyright (C) '#1072#1083#1075#1086#1088#1080#1090#1084': '#1044#1088#1091#1079#1103#1082#1072' '#1040'. '#1042'. (druz@ecoclub.nsu.ru), '#1080#1089#1087 +
        #1086#1083#1085#1077#1085#1080#1077': '#1042#1072#1081#1085#1077#1088' '#1044'. '#1040'. (dmw@mail.ru)'
    end
  end
end
