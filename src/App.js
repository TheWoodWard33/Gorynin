import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './App.css';
import Plotly from "plotly.js"
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

function App() {
  const [data,setData] = useState([])
  const [options, setOptions] = useState({
    Альфа: 0.1,
    Бета: 0.002,
    Гамма: 0.2,
    Дельта: 0.0025,
    X: 80,
    Y: 20,
    Время: 100,
  })
  const splitOptions = {
    Альфа: 100,
    Бета: 10000,
    Гамма: 100,
    Дельта: 10000,
    X: 1,
    Y: 1,
    Время: 1,
  }

  const LodkaValterraFunc = (x,y,options) => {
    const {Альфа, Бета, Гамма, Дельта} = options;
    const dx_dt = (Альфа - Бета * y) * x;
    const dy_dt = (-Гамма + Дельта * x) * y;
    return [dx_dt,dy_dt]
  }
  useEffect(() => {
    setData(() => {
      const payload = {
        dx: [],
        dy: [],
        Время: [],
      }
      let x = options.X;
      let y = options.Y;
      for (let i = 0; i < options.Время; i++) {
        payload.dx.push(x);
        payload.dy.push(y);
        payload.Время.push(i);
        const [dx,dy] = LodkaValterraFunc(x,y,options);
        x+=dx;
        y+=dy;
      }
      return payload
    })
  },[options])

  return (
    <div className="App">
      <div className="title">
        Математическое и компьютерное моделирование на примере модели "Хищник-Жертва" (Лотки-Вольтерры)
        <div className="btns">
          {Object.keys(options).map((param) => (
            <div className="btns_item">
              <div style={{minWidth: '60px'}}>{param}:</div>
              <Slider 
                value={options[param]*splitOptions[param]} 
                onChange={(data)=>{setOptions(prev => ({...prev, [param]: data/splitOptions[param]}))}}
                min={param === 'Время' ? 10 : 0}
                max={param === 'Время' ? 200 : 100}
              />
              <div style={{minWidth: '60px'}}>{options[param]}</div>
            </div>
          ))}
        </div>
        <div className="desc">
          Горынин Иван. ИДМ-22-06.
        </div>
      </div>
      <div className="graphics">
      <Plot
        data={[
          {
            x: data.Время,
            y: data.dx,
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'green'},
            name: "Популяция жертв"
          },
          {
            x: data.Время,
            y: data.dy,
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'red'},
            name: "Популяция хищников"
          },
        ]}
        layout={ {width: 600, height: 400, title: 'Зависимости популяций друг от друга.'} }
      />
      <Plot
        data={[
          {
            x: data.dx,
            y: data.dy,
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'orange'},
          },
        ]}
        layout={ {width: 600, height: 400, title: 'Фазовый портрет.'} }
      />
      </div>

    </div>
  );
}

export default App;
