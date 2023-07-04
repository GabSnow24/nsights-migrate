import {
    ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
const process = require("process")
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';


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
