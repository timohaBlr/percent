import React from "react";
import type {PayloadAction} from "@reduxjs/toolkit";
import { configureStore, createSlice, createEntityAdapter,  createSelector } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import {calcBoardVolume, calcLogVolume} from "./utils/calculators.ts";
import type {Board, Log} from "./feautures/shifts/types.ts";


// -------------------- ADAPTERS --------------------
const logsAdapter = createEntityAdapter<Log>();
const boardsAdapter = createEntityAdapter<Board>();

// -------------------- SLICE --------------------
const calculatorSlice = createSlice({
    name: "calculator",
    initialState: {
        logs: logsAdapter.getInitialState(),
        boards: boardsAdapter.getInitialState(),
    },
    reducers: {
        addLog: (state, action: PayloadAction<Omit<Log, "id">>) => {
            logsAdapter.addOne(state.logs, { ...action.payload, id: Math.random().toString(36) });
        },
        removeLog: (state, action: PayloadAction<string>) => {
            logsAdapter.removeOne(state.logs, action.payload);
        },
        addBoard: (state, action: PayloadAction<Omit<Board, "id">>) => {
            boardsAdapter.addOne(state.boards, { ...action.payload, id: Math.random().toString(36) });
        },
        updateBoard: (state, action: PayloadAction<Board>) => {
            boardsAdapter.upsertOne(state.boards, action.payload);
        },
        removeBoard: (state, action: PayloadAction<string>) => {
            boardsAdapter.removeOne(state.boards, action.payload);
        },
        clearAll: (state) => {
            logsAdapter.removeAll(state.logs);
            boardsAdapter.removeAll(state.boards);
        },
    },
});

const store = configureStore({
    reducer: {
        calculator: calculatorSlice.reducer,
    },
});

// -------------------- SELECTORS --------------------
const selectLogs = (state: any) => Object.values(state.calculator.logs.entities);
const selectBoards = (state: any) => Object.values(state.calculator.boards.entities);

const selectTotalLogVolume = createSelector(selectLogs, (logs: Log[]) =>
    logs.reduce((sum, l) => sum + calcLogVolume(l), 0)
);

const selectBoardsGrouped = createSelector(selectBoards, (boards: Board[]) => {
    const groups: Record<string, Board[]> = {};
    boards.forEach((b) => {
        if (!groups[b.length]) groups[b.length] = [];
        groups[b.length].push(b);
    });
    return groups;
});

// -------------------- COMPONENTS --------------------
const LogInput = () => {
    const dispatch = useDispatch();
    const [length, setLength] = React.useState<3 | 4 | 6>(3);

    const diameters = Array.from({ length: 24 }, (_, i) => 14 + i * 2);

    return (
        <div className="p-4 border rounded-2xl">
            <h2 className="font-bold mb-2">Бревна</h2>

            <select
               name={'length'}
                value={length}
                onChange={(e) => setLength(Number(e.target.value) as 3 | 4 | 6)}
                className="w-full mb-3"
            >
                <option value="3">3 м</option>
                <option value="4">4 м</option>
                <option value="6">6 м</option>
            </select>

            <div className="grid grid-cols-6 gap-2">
                {diameters.map((d) => (
                    <button
                        key={d}
                        onClick={() => dispatch(calculatorSlice.actions.addLog({ length, diameter: d }))}
                        className="p-2 border rounded-xl hover:bg-black hover:text-white"
                    >
                        {d}
                    </button>
                ))}
            </div>
        </div>
    );
};

const LogsDisplay = () => {
    const logs = useSelector(selectLogs);
    const dispatch = useDispatch();

    return (
        <div className="flex flex-wrap gap-2 justify-center p-4">
            {logs.map((log: Log) => (
                <div
                    key={log.id}
                    onClick={() => dispatch(calculatorSlice.actions.removeLog(log.id))}
                    className="w-12 h-12 rounded-full bg-blue-500 border-red-300 text-white flex items-center justify-center cursor-pointer"
                >
                    {log.diameter}
                </div>
            ))}
        </div>
    );
};

const BoardInput = () => {
    const dispatch = useDispatch();

    const [form, setForm] = React.useState<Omit<Board, "id">>({
        thickness: 25,
        width: 100,
        length: 4,
        quantity: 1,
    });

    return (
        <div className="p-4 border rounded-2xl">
            <h2 className="font-bold mb-2">Доски</h2>

            {Object.entries(form).map(([key, value]) => (
                <input
                    key={key}
                    type="number"
                    value={value}
                    onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                    className="w-full mb-2 p-2 border"
                />
            ))}

            <button
                onClick={() => dispatch(calculatorSlice.actions.addBoard(form))}
                className="px-4 py-2 bg-green-500 text-white rounded-xl"
            >
                Добавить
            </button>
        </div>
    );
};

const BoardsList = () => {
    const boards = useSelector(selectBoards);
    const dispatch = useDispatch();

    return (
        <div className="p-4">
            {boards.map((b: Board) => (
                <div key={b.id} className="border p-2 mb-2 rounded-xl flex gap-2">
                    <input value={b.thickness} onChange={(e) => dispatch(calculatorSlice.actions.updateBoard({ ...b, thickness: Number(e.target.value) }))} />
                    <input value={b.width} onChange={(e) => dispatch(calculatorSlice.actions.updateBoard({ ...b, width: Number(e.target.value) }))} />
                    <input value={b.quantity} onChange={(e) => dispatch(calculatorSlice.actions.updateBoard({ ...b, quantity: Number(e.target.value) }))} />
                    <button onClick={() => dispatch(calculatorSlice.actions.removeBoard(b.id))}>❌</button>
                </div>
            ))}
        </div>
    );
};

const Results = () => {
    const totalLogVolume = useSelector(selectTotalLogVolume);
    const groups = useSelector(selectBoardsGrouped);

    return (
        <div className="p-4 border rounded-2xl">
            <h2 className="font-bold">Результаты</h2>

            <p>Объем бревен: {totalLogVolume.toFixed(3)} м³</p>

            {Object.entries(groups).map(([length, boards]: any) => {
                const volume = boards.reduce((sum: number, b: Board) => sum + calcBoardVolume(b), 0);
                const yieldCoef = totalLogVolume > 0 ? volume / totalLogVolume : 0;

                return (
                    <div key={length} className="mt-2">
                        <p>Длина {length}м</p>
                        <p>Объем: {volume.toFixed(3)}</p>
                        <p>Выход: {yieldCoef.toFixed(3)}</p>
                    </div>
                );
            })}
        </div>
    );
};

const App = () => (
    <Provider store={store}>
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <LogInput />
            <LogsDisplay />
            <BoardInput />
            <BoardsList />
            <Results />
        </div>
    </Provider>
);

export default App;
