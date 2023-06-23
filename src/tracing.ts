import {
    ConsoleSpanExporter,
    SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
const process = require("process")
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';

const traceExporter = new ConsoleSpanExporter();

export const otelSDK = new NodeSDK({
    traceExporter: new ConsoleSpanExporter(),
    instrumentations: [
        new ExpressInstrumentation(),
        new AmqplibInstrumentation(),
    ],
    metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter()
    }),
});


process.on('SIGTERM', () => {
    otelSDK
        .shutdown()
        .then(
            () => console.log('SDK shut down successfully'),
            (err) => console.log('Error shutting down SDK', err),
        )
        .finally(() => process.exit(0));
});
