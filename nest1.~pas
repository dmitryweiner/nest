unit nest1;

interface

uses
  Windows, Messages, SysUtils, Classes, Graphics, Controls, Forms, Dialogs,
  ExtCtrls, ComCtrls, StdCtrls, Clipbrd;

type
  TForm1 = class(TForm)
    PageControl1: TPageControl;
    TabSheet1: TTabSheet;
    TabSheet2: TTabSheet;
    GroupBox1: TGroupBox;
    Label3: TLabel;
    RGtype: TRadioGroup;
    ListBox1: TListBox;
    Bloadbuff: TButton;
    Button2: TButton;
    ComboBox1: TComboBox;
    GroupBox2: TGroupBox;
    Img: TImage;
    Label1: TLabel;
    TB1: TTrackBar;
    UpDown1: TUpDown;
    Button1: TButton;
    Panel1: TPanel;
    ListBox2: TListBox;
    Image1: TImage;
    StatusBar1: TStatusBar;
    Button3: TButton;
    Button4: TButton;
    TabSheet3: TTabSheet;
    GroupBox4: TGroupBox;
    LB3: TListBox;
    Image2: TImage;
    Button6: TButton;
    TrackBar2: TTrackBar;
    GroupBox5: TGroupBox;
    TrackBar3: TTrackBar;
    Label2: TLabel;
    Panel2: TPanel;
    Label4: TLabel;
    procedure FormCreate(Sender: TObject);
    procedure BloadbuffClick(Sender: TObject);
    procedure TB1Change(Sender: TObject);
    procedure FormClose(Sender: TObject; var Action: TCloseAction);
    procedure UpDown1Click(Sender: TObject; Button: TUDBtnType);
    procedure Button1Click(Sender: TObject);
    procedure BneibClick(Sender: TObject);
    procedure Button2Click(Sender: TObject);
    procedure FormShow(Sender: TObject);
    procedure Button3Click(Sender: TObject);
    procedure Button6Click(Sender: TObject);
    procedure TrackBar2Change(Sender: TObject);
    procedure TrackBar3Change(Sender: TObject);
    procedure Image2MouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Integer);
    procedure Image2MouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Integer);
    procedure Image2MouseMove(Sender: TObject; Shift: TShiftState; X,
      Y: Integer);
    procedure RxTrayIcon1Click(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Integer);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

type nestpoint = record
       N:integer; //служебный номер
       Number:string; //"внешний" видимый номер
       Date:integer; //дата основания гнезда
       X,Y:Real; //координаты
       Rast:TList; //расстояния до ближайших соседей
       Delta_Rast:TList; //производная по расстояниям
       Next:pointer; //ссылка на следующее гнездо (оставлена для совместимости)
       Attempted:Boolean; //одиночное ли гнездо
       Neib_Count:integer; //кол-во ближайших соседей
       R_av:real; //среднее расстояние до ближайших соседей
       R_by_days:TList; //ср. расст. до ближайших соседей по дням (массив объектов типа R_and_day)

     end;

type dot = record
       N:integer;
       R:real;
     end;

type R_and_date = record
       date:integer;
       R:real;
     end;

var
  Form1: TForm1;
  clb:TClipboard;
  First_p:^nestpoint;
  mash:real;
  i0,j0:integer;
  i1,j1,i2,j2:integer;
  moved:Boolean;
  x0,y0:integer;

implementation

{$R *.DFM}

function Integer_to_str(i:integer):string;
var
  s:string;
begin
  str(i,s);
  Integer_to_str:=s;
end;

function Real_to_str(r:real):string;
var
  s:string;
begin
  str(r:6:3,s);
  Real_to_str:=s;
end;

function StringLen(s:string):integer;
Var
  i:integer;
begin
 i:=1;
 if s<>'' then
     begin
       while s[i]<>#0 do
         i:=i+1;
     end
  else i:=0;
 StringLen:=i;
end;//StringLen

procedure  DelComma(var s:string);
var
 i:integer;
begin
 for i:=1 to StringLen(s) do
   if s[i]=',' then s[i]:='.';
end;// DelComma(s);

procedure  UnDot(var s:string);
var
 i:integer;
begin
 for i:=1 to StringLen(s) do
   if s[i]='.' then s[i]:=',';
end;// UnDot(s);

procedure Set_R_and_Date(Number_of_nest:integer; R:real; Date:integer);
var
  temp_p:^nestpoint;
  p:pointer;
  R_date:^R_and_date;
begin
  p:=first_p;
  temp_p:=p;
  while temp_p<>nil do
    begin
      if temp_p^.N = Number_of_nest then
        begin
          New(R_date);
          R_date^.R:=R;
          R_date^.date:=Date;
          temp_p^.R_by_days.Add(R_date);
        end;
      temp_p:=temp_p^.Next;
    end;
end;//Set_R_and_Date

procedure SelectNeibs(List_in:TList);
var
 p1,p2:^nestpoint;
 i,j,k,count:integer;
 r_av,r_avav:real;
 p_real:^real;
begin
 for i:=0 to (List_in.Count-1) do
   begin
     //вычисление R ср. ср.
     count:=0;
     r_avav:=0;
     for j:=0 to (List_in.Count-1) do
       begin
         r_av:=0;
         p1:=List_in.Items[i];
         p2:=List_in.Items[j];
         if p1^.N<>p2^.N then
           begin
             for k:=1 to (Form1.ComboBox1.ItemIndex+1) do
               begin
                 if (k-1) < p2^.rast.Count then
                   begin
                     p_real:=p2^.rast.Items[k-1];
                     r_av:=r_av+p_real^;
                   end;
               end;
             r_av:=r_av/(form1.ComboBox1.ItemIndex+1);
             r_avav:=r_avav+r_av;
             count:=count+1;
           end;
       end;//while
     r_avav:=r_avav/count;
     //вывод
     p_real:=p1^.Rast.Items[0];
     if r_avav<p_real^ then
                   begin
                     p1^.Attempted:=False;
                   end
              else begin
                     p1^.Attempted:=True;
                   end;
   end;//for
end;//selectNeibs

procedure AddDot(x,y:real; N,date:integer; number:string);
var
 temp_p,new_p:^nestpoint;
 P:Pointer;
begin
 if first_p=NIL then
                    begin
                      New(first_p);
                      first_p^.X:=x;
                      first_p^.Y:=y;
                      first_p^.date:=date;
                      first_p^.N:=n;
                      first_p^.number:=number;
                      first_p^.Rast:=TList.Create;
                      first_p^.Delta_Rast:=TList.Create;
                      first_p^.R_by_days:=TList.Create;
                      first_p^.Attempted:=False;
                      first_p^.Next:=nil;
                    end
     else
                    begin
                      p:=first_p;
                      temp_p:=p;
                      while temp_p^.Next<>nil do
                        begin
                          temp_p:=temp_p^.Next;
                        end;//while
                      New(new_p);
                      new_p^.X:=x;
                      new_p^.Y:=y;
                      new_p^.date:=date;
                      new_p^.N:=n;
                      new_p^.Number:=number;
                      new_p^.Rast:=TList.Create;
                      new_p^.Delta_Rast:=TList.Create;
                      new_p^.R_by_days:=TList.Create;
                      new_p^.Attempted:=False;
                      new_p^.next:=nil;
                      temp_p^.Next:=new_p;
                    end;//if

end;//AddDot()

function MaxDate:integer;
Var p:pointer;
    temp_p:^nestpoint;
    res:integer;
begin
 p:=first_p;
 temp_p:=p;
 res:=0;
 while temp_p<>nil do
   begin
     if temp_p^.Date>res then res:=temp_p^.Date;
     temp_p:=temp_p^.Next;
   end;//while
 MaxDate:=res;
end;//MaxDate


procedure  ClearMemory;
Var p:pointer;
    temp_p,temp1_p:^nestpoint;
    pred_p:^nestpoint;
begin
 p:=first_p;
 temp_p:=p;
 while temp_p<>nil do
   begin
     temp1_p:=temp_p;
     pred_p:=nil;
     while temp1_p^.Next<>nil do
       begin
         p:=temp1_p;
         pred_p:=p;
         temp1_p:=temp1_p^.Next;
       end;//while
     if Pred_p<>nil then pred_p^.next:=nil;
     if temp1_p^.N=first_p^.n then
                               begin
                                first_p:=nil;
                                temp_p:=nil;
                               end;
     temp1_p.Rast.Clear;
     temp1_p.Delta_Rast.Clear;
     temp1_p.R_by_days.Clear;
     Dispose(temp1_p);
   end;//while
end;//ClearMemory;

function CountPoints:integer;
var
 res:integer;
 temp_p:^nestpoint;
 p:pointer;
begin
 p:=first_p;
 temp_p:=p;
 res:=0;
 while temp_p<>nil do
   begin
     res:=res+1;
     temp_p:=temp_p^.Next;
   end;//while
 CountPoints:=Res;
end;

procedure  Calc_date(list_in:Tlist);
var
  i,j,k:integer;
  L:Tlist;
  Rast:real;
  p1,p2:^nestpoint;
  temp_d,temp1_d:^dot;
  changed:boolean;
  p_real:^real;
begin
  L:=Tlist.Create;
  for i:=0 to (List_in.Count-1) do
    begin
          //заполняем список
          for j:=0 to (List_in.Count-1) do
            begin
              if (i<>j)  then
                begin
                  p1:=List_in.Items[i];
                  p2:=List_in.Items[j];
                  //деление на 2, т.к. необходима ПОЛОВИНА расстояний (confirmed by Alexey)
                  rast:=(sqrt(sqr(p1^.x-p2^.x)+sqr(p1^.y-p2^.y)))/2;
                  new(temp_d);
                  temp_d^.N:=p2^.N;
                  temp_d^.R:=rast;
                  L.Add(temp_d);
                  temp_d:=nil;
                end;//if
            end;//for
        //cортировка
        changed:=true;
        while changed do
          begin
            changed:=false;
            for k:=0 to (L.Count-2) do
              begin
                temp_d:=L.Items[k];
                temp1_d:=L.Items[k+1];
                if temp1_d^.R<temp_d^.R then
                      begin
                         L.Exchange(k,k+1);
                         Changed:=True;
                      end;
              end;//for
          end;//while
        //закидываем всё в Rast[]
        p1:=List_in.Items[i];
        p1^.Rast.Clear;
        for k:=0 to (L.Count-1) do
          begin
            temp_d:=L.Items[k];
            New(p_real);
            p_real^:=temp_d^.R;
            p1^.Rast.Add(p_real);
          end;
        L.Clear;
    end;
end;// Calc_date;

function CalcAv_date(day:integer;list_in:Tlist):string;//вычисление среднего расстояния до ближайших соседей
var
    p1:^nestpoint;
    i,i_max:integer;
    max:real;
    r:real;
    k:integer;
    p_real:^real;
    loop_limit:integer;
begin
    Form1.LB3.Clear;
    for k:=0 to (list_in.Count-1) do
      begin
        p1:=list_in.Items[k];
        if p1^.Attempted then//если не пидорок
          begin
            max:=0;
            i_max:=1;
            if p1^.Delta_Rast.Count > 6 then
              loop_limit:=5 //6 neibors
            else
              loop_limit:=p1^.Delta_Rast.Count - 1; //if less than 6
            for i:=1 to loop_limit do
              begin
                p_real:=p1^.Delta_Rast.Items[i];
                if (p_real^ > max) then
                  begin
                    max:=p_real^;
                    i_max:=i;
                  end;//if
              end;
            r:=0;
            for i:=0 to i_max do
              begin
                p_real:=p1^.Rast.Items[i];
                r:=r+p_real^;
              end;
            r:=r/(i_max+1);
            p1^.R_av:=r;
            Set_R_and_Date(p1^.N, r, day);
            p1^.Neib_Count:=i_max+1;
          end;//if
      end;//for
end;// CalcAv_date;

procedure  DeltaCalc_date(list_in:TList);
var
    p1:^nestpoint;
    max:real;
    i,k:integer;
    p_real_1, p_real_2, p_real_3:^real;
begin
    for k:=0 to (list_in.Count-1) do
      begin
        p1:=list_in.Items[k];
        //вычисление дельты
        p1^.Delta_Rast.Clear;
        for i:=0 to p1^.Rast.Count-2 do
          begin
            p_real_1:=p1^.Rast.Items[i+1];
            p_real_2:=p1^.Rast.Items[i];
            New(p_real_3);
            p_real_3^:=p_real_1^-p_real_2^;
            p1^.Delta_Rast.Add(p_real_3);
          end;
        //поиск максимальной
        max:=0;
        for i:=0 to p1^.Delta_Rast.Count-1 do
          begin
            p_real_1:=p1^.Delta_Rast.Items[i];
            if p_real_1^ > max then
              max:=p_real_1^;
          end;
        //нормализация
        if max > 0 then
         for i:=0 to p1^.Delta_Rast.Count-1 do
           begin
             p_real_1:=p1^.Delta_Rast.Items[i];
             p_real_1^:=p_real_1^/max;
           end;
      end;//for
end;// DeltaCalc_date;

procedure  DrawResults(m:real);
var
  N,i:integer;
  pos:integer;
  temp_p:^nestpoint;
  p:pointer;
  X,Y,X_old,Y_old:integer;
  s,s1:string;
  t,max:real;
  p_real:^real;
begin
 N:=CountPoints;
 with form1 do
begin
 TB1.Max:=N;
 TB1.Min:=1;
 pos:= TB1.position;
 Img.Canvas.Brush.Color:=clWhite;
 Img.Canvas.Rectangle(0,0,Img.Width,Img.Height);
 p:=first_p;
 temp_p:=p;
 i:=1;
 Img.Canvas.Pen.Color:=clBlue;
 Img.Canvas.MoveTo(10,10);
 Img.Canvas.LineTo(10,Img.Height-10);
 Img.Canvas.MoveTo(10,10);
 Img.Canvas.LineTo(7,13);
 Img.Canvas.MoveTo(10,10);
 Img.Canvas.LineTo(13,13);

 Img.Canvas.MoveTo(10,Img.Height-10);
 Img.Canvas.LineTo(Img.Width-10,Img.Height-10);
 Img.Canvas.LineTo(Img.Width-13,Img.Height-13);
 Img.Canvas.MoveTo(Img.Width-10,Img.Height-10);
 Img.Canvas.LineTo(Img.Width-13,Img.Height-7);

 Img.Canvas.TextOut(Img.Width-10,Img.Height-25,'N');
 Img.Canvas.TextOut(2,10,'L');

 i:=1;
 while true do       //poisk nuzhnogo e'lementa
   begin
     if i=pos then break;
     i:=i+1;
     temp_p:=temp_p^.Next;
   end;

 //вывод заголовка
 str(pos,s);
 str(N,s1);
 Img.Canvas.Pen.Color:=clBlue;
 Img.Canvas.TextOut(15,1,'Nest #:'+temp_p^.Number+' ('+s+'/'+s1+').');

 max:=0;
 for i:=1 to (N-1) do      //najti max
   begin
     if (i-1) < temp_p^.Rast.Count then
       begin
         p_real:=temp_p^.Rast.Items[i-1];
         if p_real^ > max then
           max:=p_real^;
       end;
   end;
 if m>0 then
   begin    //m<0 -самому искать масштаб
     max:=max*m;
   end;
  //riski
    Img.Canvas.Pen.Color:=clBlack;
  for i:=1 to round((Img.Height-20)/max)  do
    begin
     y:=Img.Height-round(i*(Img.Height-20)/max)-10;
     Img.Canvas.MoveTo(10,y);
     Img.Canvas.LineTo(13,y);
    end;
  for i:=1 to N-1  do
    begin
     x:=i*((Img.Width-20) div (n))+10;
     Img.Canvas.MoveTo(x,Img.Height-10);
     Img.Canvas.LineTo(x,Img.Height-13);
    end;

 //vyvod Rast
 x_old:=10;
 y_old:=Img.Height-10;
 Img.Canvas.Pen.Color:=clGreen;
 for i:=1 to (N-1) do
   begin
     x:=i*((Img.Width-20) div (n))+10;
     if (i-1) < temp_p^.Rast.Count then
       begin
         p_real:=temp_p^.Rast.Items[i-1];
         t:=p_real^*(Img.Height-20)/max;
        end;
     y:=Img.Height-round(t)-10;
     Img.Canvas.Pen.Color:=clGreen;
     Img.Canvas.MoveTo(x_old,y_old);
     Img.Canvas.LineTo(x,y);
     Img.Canvas.Pen.Color:=clBlack;
     Img.Canvas.Rectangle(x-1,y-1,x+1,y+1);
     x_old:=x;
     y_old:=y;
   end;

 //vyvod DeltaRast
   x_old:=10;
   y_old:=Img.Height-10;
   Img.Canvas.Pen.Color:=clRed;
 for i:=1 to temp_p^.Delta_Rast.Count do
   begin
    x:=i*((Img.Width-20) div (n))+10;
    p_real:=temp_p^.Delta_Rast.Items[i-1];
    t:=p_real^*(Img.Height-20)/max;
    y:=Img.Height-round(t)-10;
    Img.Canvas.Pen.Color:=clRed;
    Img.Canvas.MoveTo(x_old,y_old);
    Img.Canvas.LineTo(x,y);
    Img.Canvas.Pen.Color:=clBlack;
    Img.Canvas.Rectangle(x-1,y-1,x+1,y+1);
    x_old:=x;
    y_old:=y;
   end;
end;//with
end;// DrawResults;

procedure DrawMapR(K:real);
var
 p1:^nestpoint;
 t:pointer;
 s1:string;
 mash:real;
 max_x,min_x:real;
 max_y,min_y:real;
 cx,cy:real;
begin
with Form1 do
begin
 //очистка
 Image1.Canvas.Brush.Color:=clWhite;
 Image1.Canvas.Rectangle(0,0,Image1.Width,Image1.Height);
 //выбор масштаба
 t:=first_p;
 p1:=t;
 max_x:=0;
 max_y:=0;
 while p1 <> nil do
   begin
     if p1^.y>max_y then max_y:=p1^.y;
     if p1^.y>max_x then max_x:=p1^.x;
     p1:=p1^.Next;
   end;
 t:=first_p;
 p1:=t;
 min_x:=max_x;
 min_y:=max_y;
 while p1 <> nil do
   begin
     if p1^.Y<min_y then min_y:=p1^.Y;
     if p1^.Y<min_x then min_x:=p1^.x;
     p1:=p1^.Next;
   end;
 if k<0 then
        mash:=(Image1.Width)/(-min_y+max_y)
   else mash:=K*(Image1.Width)/(-min_y+max_y);
 cx:=(max_x+min_x)/2;
 cy:=(max_y+min_y)/2;
      //вывод
 t:=first_p;
 p1:=t;
 while p1 <> nil do
   begin
     s1:=p1^.Number;
     Image1.Canvas.Brush.Color:=clWhite;
     Image1.Canvas.Brush.Style:=bsClear;
     if not(p1^.Attempted) then
                   begin
                     Image1.Canvas.Pen.Color:=clRed;
                     Image1.Canvas.Rectangle(Image1.width div 2 + round((p1^.x-cx)*mash)-1,Image1.height div 2 - round((p1^.y-cy)*mash)-1,Image1.width div 2 + round((p1^.x-cx)*mash)+1,Image1.height div 2 - round((p1^.y-cy)*mash)+1);
                     Image1.Canvas.Font.Color:=clRed;
                     Image1.Canvas.TextOut(Image1.width div 2 + round((p1^.x-cx)*mash),Image1.height div 2 - round((p1^.y-cy)*mash),s1);
                   end
              else begin
                     Image1.Canvas.pen.Color:=clGreen;
                     Image1.Canvas.Rectangle(Image1.width div 2 + round((p1^.x-cx)*mash)-1,Image1.height div 2 - round((p1^.y-cy)*mash)-1,Image1.width div 2 + round((p1^.x-cx)*mash)+1,Image1.height div 2 - round((p1^.y-cy)*mash)+1);
                     Image1.Canvas.Font.Color:=clGreen;
                     Image1.Canvas.TextOut(Image1.width div 2 + round((p1^.x-cx)*mash),Image1.height div 2 - round((p1^.y-cy)*mash),s1);
                   end;
      p1:=p1^.Next;
   end;//while
end;//with
end;

procedure DrawMap(K:real; cx_m,cy_m:integer);
var
 p1:^nestpoint;
 t:pointer;
 s1:string;
 mash:real;
 max_x,min_x:real;
 max_y,min_y:real;
 cx,cy:real;
begin
with Form1.Image2 do
begin
 //очистка
 Canvas.Brush.Color:=clWhite;
 Canvas.Rectangle(0,0,Width,Height);
 //выбор масштаба
 t:=first_p;
 p1:=t;
 max_x:=0;
 max_y:=0;
 while p1 <> nil do
   begin
     if p1^.y>max_y then max_y:=p1^.y;
     if p1^.y>max_x then max_x:=p1^.x;
     p1:=p1^.Next;
   end;
 t:=first_p;
 p1:=t;
 min_x:=max_x;
 min_y:=max_y;
 while p1 <> nil do
   begin
     if p1^.Y<min_y then min_y:=p1^.Y;
     if p1^.Y<min_x then min_x:=p1^.x;
     p1:=p1^.Next;
   end;
 if k<0 then
        mash:=(Height)/(-min_y+max_y)
   else mash:=K*(Height)/(-min_y+max_y);

 cx:=(max_x+min_x)/2;
 cy:=(max_y+min_y)/2;
{ if (cx_m>=0) and (cy_m>=0) then
   begin
     cx:=(cx_m-width/2)/mash+cx;
     cy:=-(cy_m-height/2)/mash+cy;
     x0:=cx_m;
     y0:=cy_m;
   end; }
      //вывод
 t:=first_p;
 p1:=t;
 while p1 <> nil do
   begin
     s1:=p1^.Number;
     Canvas.Brush.Color:=clWhite;
     Canvas.Brush.Style:=bsClear;
     if not(p1^.Attempted) then
                   begin
                     Canvas.Pen.Color:=clRed;
                     Canvas.Rectangle(cx_m + round((p1^.x-cx)*mash)-1,cy_m - round((p1^.y-cy)*mash)-1,cx_m + round((p1^.x-cx)*mash)+1,cy_m - round((p1^.y-cy)*mash)+1);
                     Canvas.Font.Color:=clRed;
                     Canvas.TextOut(cx_m + round((p1^.x-cx)*mash),cy_m - round((p1^.y-cy)*mash),s1);
                   end
              else begin
                     Canvas.pen.Color:=clGreen;
                     Canvas.Rectangle(cx_m + round((p1^.x-cx)*mash)-1,cy_m - round((p1^.y-cy)*mash)-1,cx_m + round((p1^.x-cx)*mash)+1,cy_m - round((p1^.y-cy)*mash)+1);
                     Canvas.Ellipse(cx_m + round((p1^.x-p1^.R_av-cx)*mash),cy_m - round((p1^.y+p1^.R_av-cy)*mash),cx_m + round((p1^.x+p1^.R_av-cx)*mash),cy_m - round((p1^.y-p1^.R_av-cy)*mash));                     Canvas.Font.Color:=clGreen;
                     Canvas.Font.Color:=clGreen;
                     Canvas.TextOut(cx_m + round((p1^.x-cx)*mash),cy_m - round((p1^.y-cy)*mash),s1);
                   end;
      p1:=p1^.Next;
   end;//while
end;//with
end;//DrawMap

function check(s:string; select:integer):boolean;
var
   sh:string;
   i,j:integer;
   Res:boolean;
   Find:Boolean;
 begin
   Res:=False;
if s<>'' then
   case select of
     0:begin
         sh:=#9#13#10;
         j:=1;
         find:=False;
         for i:=1 to StringLen(s) do
           begin
             if s[i]=sh[j] then
               if j=3 then begin
                             j:=1;
                             Find:=True;
                           end
                   else    begin
                             j:=j+1;
                             Find:=True;
                           end;
           end;//for
         if (Find) and (j=1) then Res:=True;
       end;
     1:begin
         sh:=#9#9#13#10;
         j:=1;
         find:=False;
         for i:=1 to StringLen(s) do
           begin
             if s[i]=sh[j] then
               if j=4 then begin
                             j:=1;
                             Find:=True;
                           end
                   else    begin
                             j:=j+1;
                             Find:=True;
                           end;
           end;//for
         if (Find) and (j=1) then Res:=True;
       end;
     2:begin
         sh:=#9#9#9#13#10;
         j:=1;
         find:=False;
         for i:=1 to StringLen(s) do
           begin
             if s[i]=sh[j] then
               if j=5 then begin
                             j:=1;
                             Find:=True;
                           end
                   else    begin
                             j:=j+1;
                             Find:=True;
                           end;
           end;//for
         if (Find) and (j=1) then Res:=True;
       end;
   end;//case
   Check:=Res;
 end;//check()


//==========================================================
procedure TForm1.FormCreate(Sender: TObject);
begin
 i0:=Image2.Width div 2;
 j0:=Image2.Height div 2;
 x0:=0;
 y0:=0;
 Moved:=False;
 clb:=TClipboard.Create;
 mash:=1;
 UpDown1.Position:=50;
 ComboBox1.ItemIndex:=2;
 PageControl1.ActivePageIndex:=0;
 //TrackBar2.Position:=(TrackBar3.Max-TrackBar3.Min) div 2;
end;

procedure TForm1.BloadbuffClick(Sender: TObject);
Var
  s_x,s_y,s_date,s_number:string;
  i,j:integer;
  x,y:real;
  date:integer;
  s:ansistring;
  s_buf, s_to_ListBox:string;
  code:integer;
  L:TList;
  p:Pointer;
  temp_p:^NestPoint;
  Count:integer;
  pch_buf:PChar;
  R_date:^R_and_date;
begin
 s_buf:='';
 s:='';
 L:=Tlist.Create;
 Clb.Open;
 s:=Clb.AsText;
 Clb.Close;
 DelComma(s);
 if check(s,RGtype.ItemIndex) then
begin
 case RGtype.ItemIndex of
  0: begin   //просто координаты
     j:=1;
     i:=1;
     ListBox1.Items.Clear;
     ClearMemory;
     while j<StringLen(s) do
     begin
       s_x:='';
       while (s[j]<>#9) and (j<StringLen(s)) do
         begin
           s_x:=s_x+s[j];
           j:=j+1;
         end;//while
       s_y:='';
       j:=j+1;
       while (s[j]<>#13) and (j<StringLen(s)) do
         begin
           s_y:=s_y+s[j];
           j:=j+1;
         end;//while
       ListBox1.Items.Add(s_x+';'+s_y);
       Val(s_x,x,code);
       Val(s_y,y,code);
//       if i=74 then
//              AddDot(x,y,i,0,Integer_to_str(i))
//            else
       AddDot(x,y,i,0,Integer_to_str(i));
       i:=i+1;
       j:=j+2;
     end;//while
     end;//case 0
  1: begin
     j:=1;
     i:=1;
     ListBox1.Items.Clear;
     ClearMemory;
     while j<StringLen(s) do
     begin
       s_number:='';
       while (s[j]<>#9) and (j<StringLen(s)) do
         begin
           s_number:=s_number+s[j];
           j:=j+1;
         end;//while
       j:=j+1;
       s_x:='';
       while (s[j]<>#9) and (j<StringLen(s)) do
         begin
           s_x:=s_x+s[j];
           j:=j+1;
         end;//while
       j:=j+1;
       s_y:='';
       while (s[j]<>#13) and (j<StringLen(s)) do
         begin
           s_y:=s_y+s[j];
           j:=j+1;
         end;//while
       j:=j+2;
       ListBox1.Items.Add('№'+s_number+' '+s_x+';'+s_y);
       Val(s_x,x,code);
       Val(s_y,y,code);
       //Val(s_number,number,code);
       AddDot(x,y,i,0,s_number);
       i:=i+1;

     end;//while
     end;//case 1
  2: begin
     j:=1;
     i:=1;
     ListBox1.Items.Clear;
     ClearMemory;
     while j<StringLen(s) do
     begin
       s_number:='';
       while (s[j]<>#9) and (j<StringLen(s)) do
         begin
           s_number:=s_number+s[j];
           j:=j+1;
         end;//while
       j:=j+1;
       s_date:='';
       while (s[j]<>#9) and (j<StringLen(s)) do
         begin
           s_date:=s_date+s[j];
           j:=j+1;
         end;//while
       j:=j+1;
       s_x:='';
       while (s[j]<>#9) and (j<StringLen(s)) do
         begin
           s_x:=s_x+s[j];
           j:=j+1;
         end;//while
       j:=j+1;
       s_y:='';
       while (s[j]<>#13) and (j<StringLen(s)) do
         begin
           s_y:=s_y+s[j];
           j:=j+1;
         end;//while
       j:=j+2;
       ListBox1.Items.Add('№'+s_number+' ('+s_date+' день) '+s_x+';'+s_y);
       Val(s_x,x,code);
       Val(s_date,date,code);
       Val(s_y,y,code);
       //Val(s_number,number,code);
       AddDot(x,y,i,date,s_number);
       i:=i+1;
     end;//while
     end;//case 2
 end;//case
 StatusBar1.SimpleText:='Подождите, идет обработка данных.';
 TB1.Enabled:=True;
 case Form1.RGtype.ItemIndex of
   0,1:begin
         L.Clear;
         p:=first_p;
         temp_p:=p;
         while temp_p<>nil do //перегружаем в TList все гнёзда
           begin
             L.Add(temp_p);
             temp_p:=temp_p^.Next;
           end;//while
         Calc_date(L);
         DeltaCalc_date(L);
         SelectNeibs(L);
         CalcAv_date(0,L);
         //вывод
         s_buf:='';
         s_buf:='Number'+#9+'R'+#9+'Neib'+#13+#10; //Заголовок
         for i:=0 to L.Count-1 do
           begin
             s_to_ListBox:='';
             temp_p:=L.Items[i];
             s_buf:=s_buf+temp_p^.Number+#9;
             s_to_ListBox:=temp_p^.Number+' ';
             if temp_p^.Attempted then
               begin
                 R_date:=temp_p^.R_by_days.Items[0];
                 s_buf:=s_buf+Real_to_str(R_date.R)+#9;
                 s_to_ListBox:=s_to_ListBox+Real_to_str(R_date.R)+' ';
                 s_buf:=s_buf+Integer_to_str(temp_p^.Neib_Count)+#13+#10;
                 s_to_ListBox:=s_to_ListBox+Integer_to_str(temp_p^.Neib_Count)+' ';//сколько соседей
                 LB3.Items.Add(s_to_ListBox);
               end
             else
               begin
                 s_buf:=s_buf+'NAN'+#9+'0'+#13+#10;
                 s_to_ListBox:=s_to_ListBox+'NAN 0';
                 LB3.Items.Add(s_to_ListBox);
               end;
         end;
         StatusBar1.SimpleText:='Данные загружены. Предварительная обработка проведена.';
         L.Clear;
         //TB1.Enabled:=True;
       end;
   2:  begin
         L.Clear;
         for i:=1 to MaxDate() do
           begin
             //отбираем всех, у кого date<=i
             p:=first_p;
             temp_p:=p;
             while temp_p<>nil do //перегружаем в TList гнёзда с нужной датой
               begin
                 if (temp_p^.Date<=i) then
                   L.Add(temp_p);
                 temp_p:=temp_p^.Next;
               end;//while
             //cчитаем для отобранных пидорков
             if L.count>1 then //если хоть кто-то есть
               begin
                 Calc_date(L); //расстояния до соседей
                 DeltaCalc_date(L); //дельта расстояний
                 SelectNeibs(L);
                 CalcAv_date(i,L);  //расчет средних расстояний. Средние расстояния сохраняются в глобальном списке
               end;
             L.Clear;
           end;//for
         //создание строки результата
         //выбор всех гнёзд и выбор R0 и Rк
         s_buf:='';
         s_buf:='Number'+#9+'R0'+#9+'Rk'+#13+#10; //Заголовок
         p:=first_p;
         temp_p:=p;
         while temp_p<>nil do //перегружаем в TList все гнёзда
           begin
             L.Add(temp_p);
             temp_p:=temp_p^.Next;
           end;//while
         for i:=0 to L.Count-1 do
           begin
             s_to_ListBox:='';
             temp_p:=L.Items[i];
             s_buf:=s_buf+temp_p^.Number+#9;
             s_to_ListBox:=temp_p^.Number+' ';
             Count:=temp_p^.R_by_days.Count;
             if Count > 0 then
               begin
                 R_date:=temp_p^.R_by_days.Items[0];
                 s_buf:=s_buf+Real_to_str(R_date.R)+#9;
                 s_to_ListBox:=s_to_ListBox+Real_to_str(R_date.R)+' ';
                 R_date:=temp_p^.R_by_days.Items[Count-1];
                 s_buf:=s_buf+Real_to_str(R_date.R)+#13+#10;
                 s_to_ListBox:=s_to_ListBox+Real_to_str(R_date.R);
                 //s:=s+Integer_to_str(Count)+#13+#10;
                 //s_to_ListBox:=s_to_ListBox+Integer_to_str(Count)+' ';//сколько соседей
                 LB3.Items.Add(s_to_ListBox);
               end
             else
               begin
                 s_buf:=s_buf+'NAN'+#9+'NAN'+#13+#10;
                 s_to_ListBox:=s_to_ListBox+'NAN NAN';
                 LB3.Items.Add(s_to_ListBox);
               end;
         end;
         L.Clear;
         //Button4.OnClick(sender);
       end;
 end;
 //вывод в буфер
 UnDot(s_buf);
 pch_buf:=StrAlloc(stringLen(s_buf)+2);
 for i:=1 to stringLen(s_buf) do
   pch_buf[i-1]:=s_buf[i];
 pch_buf[stringLen(s_buf)]:=#0;
 Clb.Open;
 Clb.SetTextBuf(pch_buf);
 Clb.Close;
 Form1.Label2.Caption:='Результат в буфере.';
 s_buf:='';
 StrDispose(pch_buf);
 //вывод на экран
 PageControl1.ActivePageIndex:=2;
 DrawMap(1,i0,j0);
 StatusBar1.SimpleText:='Вычисления завершены. Результат сохранен в буфер обмена.';
end
 else
begin
  StatusBar1.Canvas.Font.Color:=ClRed;
  StatusBar1.SimpleText:='';
  StatusBar1.Canvas.TextOut(1,4,'Ошибка данных.');
  If code<>0 then StatusBar1.SimpleText:=StatusBar1.SimpleText+' Неверный чиловой формат.';
  StatusBar1.Canvas.Font.Color:=clBlack;
end;
 Clb.Close;
end;

procedure TForm1.TB1Change(Sender: TObject);
begin
 DrawResults(mash);
end;

procedure TForm1.FormClose(Sender: TObject; var Action: TCloseAction);
begin
 ClearMemory;
end;

procedure TForm1.UpDown1Click(Sender: TObject; Button: TUDBtnType);
begin
  if Button=BTnext then
                       begin
                        if mash>0.2 then mash:=mash-0.1;
                       end;
  if Button=BTprev then mash:=mash+0.1;
 DrawResults(mash);
end;

procedure TForm1.Button1Click(Sender: TObject);
begin
 mash:=1;
 DrawResults(-1);
 UpDown1.Position:=50;
end;

procedure TForm1.BneibClick(Sender: TObject);
var
 p1,p2:^nestpoint;
 t:pointer;
 i,j:integer;
 r_av,r_avav:real;
 s1:string;
 p_real:^real;
begin
 PageControl1.ActivePageIndex:=1;
 ListBox2.Clear;
 t:=first_p;
 p1:=t;
 while p1 <> nil do
   begin
     //вычисление R ср. ср.
     t:=first_p;
     p2:=t;
     j:=0;
     r_avav:=0;
     while p2 <> nil do
       begin
         r_av:=0;
         if p1^.N<>p2^.N then
           begin
             for i:=1 to ComboBox1.ItemIndex+1 do
               begin
                 if (i-1) < p2^.rast.Count then
                   begin
                     p_real:=p2^.rast.Items[i-1];
                     r_av:=r_av+p_real^;
                   end;
               end;
             r_av:=r_av/(ComboBox1.ItemIndex+1);
             r_avav:=r_avav+r_av;
             j:=j+1;
           end;
         p2:=p2^.Next;
       end;//while
     r_avav:=r_avav/j;

     str(p1^.N,s1);
     //вывод
     p_real:=p1^.Rast.Items[0];
     if r_avav < p_real^ then
                   begin
                     ListBox2.Items.Add('Гнездо №'+s1+' отброшено.');
                     p1^.Attempted:=False;
                   end
              else begin
                     ListBox2.Items.Add('Гнездо №'+s1+' принято.');
                     p1^.Attempted:=True;
                   end;
     p1:=p1^.Next;
   end;//while
  DrawMapR(-1);
  StatusBar1.SimpleText:='Cоседи отобраны. Нажмите "Вычислить средние расстояния" для продолжения работы.';
end;

procedure TForm1.Button2Click(Sender: TObject);
begin
 ClearMemory;
 ListBox1.Clear;
 Img.Canvas.Brush.Color:=clWhite;
 Img.Canvas.Rectangle(0,0,Img.Width,Img.Height);
 StatusBar1.SimpleText:='Память очищена.';
 TB1.Enabled:=false;
 TB1.Position:=1;
end;

procedure TForm1.FormShow(Sender: TObject);
begin
 Form1.TabSheet1.TabVisible:=False;
 Form1.TabSheet2.TabVisible:=False;
 Form1.TabSheet3.TabVisible:=False;
 Form1.PageControl1.Enabled:=True;
 Form1.PageControl1.ActivePageIndex:=0;
 StatusBar1.SimpleText:='Система загружена и готова к работе.';
end;

procedure TForm1.Button3Click(Sender: TObject);
begin
 PageControl1.ActivePageIndex:=0;
 TB1Change(Sender);
end;

procedure TForm1.Button6Click(Sender: TObject);
begin
  PageControl1.ActivePageIndex:=0;
  Form1.Label2.Caption:='';
  TrackBar2Change(Sender);
end;

procedure TForm1.TrackBar2Change(Sender: TObject);
begin
  DrawMapR(0.5+(TrackBar2.max-TrackBar2.Position)/(TrackBar2.max-TrackBar2.min));
  StatusBar1.SimpleText:='Изменение масштаба.';
end;

procedure TForm1.TrackBar3Change(Sender: TObject);
begin
    DrawMap(0.01*(TrackBar3.Position),i0,j0);
    StatusBar1.SimpleText:='Изменение масштаба.';
end;

procedure TForm1.Image2MouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Integer);
begin
  i1:=x;
  j1:=y;
  Moved:=True;
  Image2.Canvas.Pen.Color:=clBlue;
  Image2.Canvas.Rectangle(x-2,y-2,x+2,y+2);
end;

procedure TForm1.Image2MouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Integer);
begin
  i2:=x;
  j2:=y;
  Moved:=False;
  i0:=i0+(i2-i1);
  j0:=j0+(j2-j1);
  DrawMap(0.01*(TrackBar3.Position),i0,j0);
end;

procedure TForm1.Image2MouseMove(Sender: TObject; Shift: TShiftState; X,
  Y: Integer);
begin
  if Moved then
    begin
      if (x0<>0) and (y0<>0) then
        begin
          Image2.Canvas.Pen.Color:=clWhite;
          Image2.Canvas.Rectangle(x0-2,y0-2,x0+2,y0+2);
        end;
      Image2.Canvas.Pen.Color:=clBlue;
      Image2.Canvas.Rectangle(x-2,y-2,x+2,y+2);
      x0:=x;
      y0:=y;
    end;

end;

procedure TForm1.RxTrayIcon1Click(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Integer);
begin
  Form1.DoShow;
end;

end.
